
// Strava API Configuration
// Replace these with your actual credentials from https://www.strava.com/settings/api
const STRAVA_CONFIG = {
  clientId: 'YOUR_STRAVA_CLIENT_ID',
  clientSecret: 'YOUR_STRAVA_CLIENT_SECRET',
  redirectUri: window.location.origin,
};

const BASE_URL = 'https://www.strava.com/api/v3';

export const getAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: STRAVA_CONFIG.clientId,
    redirect_uri: STRAVA_CONFIG.redirectUri,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'read,read_all,profile:read_all,activity:read_all',
  });
  return `https://www.strava.com/oauth/authorize?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string) => {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: STRAVA_CONFIG.clientId,
      client_secret: STRAVA_CONFIG.clientSecret,
      code,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) throw new Error('Failed to exchange code for token');
  
  const data = await response.json();
  saveTokens(data);
  return data;
};

const saveTokens = (data: any) => {
  localStorage.setItem('strava_access_token', data.access_token);
  localStorage.setItem('strava_refresh_token', data.refresh_token);
  localStorage.setItem('strava_expires_at', data.expires_at.toString());
  localStorage.setItem('strava_athlete', JSON.stringify(data.athlete));
};

export const getAccessToken = async () => {
  const expiresAt = parseInt(localStorage.getItem('strava_expires_at') || '0');
  const now = Math.floor(Date.now() / 1000);

  if (now > expiresAt - 600) { // Refresh if expiring in less than 10 mins
    return await refreshAccessToken();
  }

  return localStorage.getItem('strava_access_token');
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('strava_refresh_token');
  if (!refreshToken) return null;

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: STRAVA_CONFIG.clientId,
      client_secret: STRAVA_CONFIG.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  saveTokens(data);
  return data.access_token;
};

export const stravaFetch = async (endpoint: string) => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.clear();
      window.location.reload();
    }
    throw new Error(`Strava API Error: ${response.statusText}`);
  }

  return await response.json();
};

export const logout = () => {
  localStorage.clear();
};
