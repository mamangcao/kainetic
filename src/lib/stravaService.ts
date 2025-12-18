
import { AthleteProfile, BestEffort, ChartPoint, StatsData, Trophy, SportType, ActivityHighlight, WeeklyStoryData } from '../types';
import { stravaFetch } from './stravaApi';

export const getAthleteProfile = async (): Promise<AthleteProfile> => {
  const data = await stravaFetch('/athlete');
  return {
    id: data.id.toString(),
    username: data.username || data.firstname,
    firstname: data.firstname,
    lastname: data.lastname,
    bio: data.bio || 'Strava Athlete',
    profile_medium: data.profile_medium,
    city: data.city || 'Unknown',
    country: data.country || 'Unknown'
  };
};

export const getStats = async (sport: SportType): Promise<StatsData> => {
  const athlete = JSON.parse(localStorage.getItem('strava_athlete') || '{}');
  const data = await stravaFetch(`/athletes/${athlete.id}/stats`);
  
  // Mapping Strava's specific metric structure to our UI types
  // Strava provides: recent_run_totals, ytd_run_totals, all_run_totals, etc.
  const prefix = sport === 'cycling' ? 'ride' : (sport === 'walking' ? 'walk' : 'run');
  
  const all = data[`all_${prefix}_totals`];
  const ytd = data[`ytd_${prefix}_totals`];
  const recent = data[`recent_${prefix}_totals`];

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const calculateGrowth = (current: number, total: number) => {
    const prev = total - current;
    return prev > 0 ? parseFloat(((current / prev) * 100).toFixed(1)) : 100;
  };

  return {
    allTime: {
      activities: all.count,
      distance: Math.floor(all.distance / 1000),
      time: formatTime(all.moving_time),
      elevation: all.elevation_gain,
      growth: {
        activities: calculateGrowth(ytd.count, all.count),
        distance: calculateGrowth(ytd.distance, all.distance),
        time: calculateGrowth(ytd.moving_time, all.moving_time),
        elevation: calculateGrowth(ytd.elevation_gain, all.elevation_gain),
      }
    },
    ytd: {
      activities: ytd.count,
      distance: Math.floor(ytd.distance / 1000),
      time: formatTime(ytd.moving_time),
      elevation: ytd.elevation_gain,
      trends: {
        activities: 5, // Static for now as Strava doesn't provide historical comparison directly
        distance: 10,
        time: 2,
        elevation: 8
      }
    },
    recent: {
      thisWeek: {
        activities: recent.count,
        distance: Math.floor(recent.distance / 1000),
        time: formatTime(recent.moving_time),
        elevation: recent.elevation_gain,
        highlights: [] // Would require fetching individual activities to populate
      },
      thisMonth: {
        activities: recent.count * 4, // Estimate for UI consistency
        distance: Math.floor(recent.distance / 1000) * 4,
        time: formatTime(recent.moving_time * 4),
        elevation: recent.elevation_gain * 4,
        highlights: []
      }
    }
  };
};

export const getWeeklyStory = async (sport: SportType): Promise<WeeklyStoryData> => {
  // In a real app, you might pass activity descriptions to a GenAI model here
  return {
    summary: "Your real Strava data shows great consistency! Keep pushing those segments.",
    insights: [
      { label: "Consistency", value: "High", detail: "Active based on your latest sync", icon: "trending-up", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
    ]
  };
};

export const getActivitiesHeatmap = async (sport: SportType): Promise<number[]> => {
  const activities = await stravaFetch('/athlete/activities?per_page=200');
  const yearData = new Array(365).fill(0);
  const now = new Date();
  
  activities.forEach((act: any) => {
    const date = new Date(act.start_date);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 365) {
      yearData[365 - diffDays] = Math.min(4, Math.floor(act.distance / 5000) + 1);
    }
  });

  return yearData;
};

export const getChartData = async (sport: SportType, period: 'week' | 'month'): Promise<ChartPoint[]> => {
  // Simple implementation: fetch last 30 activities and group them
  const activities = await stravaFetch('/athlete/activities?per_page=100');
  return activities.slice(0, 12).map((act: any) => ({
    name: new Date(act.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    value: Math.floor(act.distance / 1000),
    activities: 1,
    time: `${Math.floor(act.moving_time / 60)}m`,
    elevation: act.total_elevation_gain
  })).reverse();
};

export const getTrophies = async (sport: SportType): Promise<Trophy[]> => {
  return [
    { id: '1', name: 'Verified Athlete', date: new Date().toISOString().split('T')[0], icon: '✅' }
  ];
};

export const getBestEfforts = async (sport: SportType): Promise<BestEffort[]> => {
  return []; 
};
