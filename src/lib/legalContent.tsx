import React from 'react';

export const PRIVACY_POLICY = (
  <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

    <h4 className="text-slate-900 font-bold text-base mt-4">1. Introduction</h4>
    <p>
      Kainetic (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) values your privacy. This policy explains how we handle your data when you use our dashboard.
      By authenticating with Strava, you consent to the practices described below.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">2. Data We Collect</h4>
    <p>We only access data explicitly provided by the Strava API, including:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>Profile Information:</strong> Name, profile picture, city, and country.</li>
      <li><strong>Activity Data:</strong> Activity types (run, ride, walk), distances, durations, elevation gain, and dates.</li>
    </ul>

    <h4 className="text-slate-900 font-bold text-base mt-4">3. How We Use Your Data</h4>
    <p>
      Your data is used <strong>solely</strong> for generating the visualizations, statistics, and heatmaps displayed on your personal dashboard.
      We do not sell, trade, or transfer your data to third parties.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">4. Data Storage</h4>
    <p>
      Kainetic is a client-side application. We do not permanently store your activity history on our servers.
      Data is fetched live from Strava and may be temporarily cached in your browser&apos;s session storage for performance.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">5. Analytics</h4>
    <p>
      We use <strong>Vercel Web Analytics</strong> to understand how visitors interact with the dashboard and improve its functionality.
      This analytics tool does <strong>not</strong> collect personal data, IP addresses, or any Strava activity information. All tracking is anonymous and aggregated.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">6. Your Rights</h4>
    <p>
      You may revoke Kainetic&apos;s access to your data at any time by visiting your{" "}
      <a
        href="https://www.strava.com/settings/apps"
        target="_blank"
        className="text-blue-600 hover:underline"
      >
        Strava Apps Settings
      </a>.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">7. Disclaimer</h4>
    <p>
      Kainetic is provided &quot;as is&quot; and is not affiliated with or endorsed by Strava, Inc.
      Use of this dashboard is at your own risk.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">8. Contact</h4>
    <p>
      If you have any questions about this Privacy Policy, please contact us at:
      <br />
      <strong>[your email here]</strong>
    </p>
  </div>
);

export const TERMS_OF_SERVICE = (
  <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
    <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>

    <h4 className="text-slate-900 font-bold text-base mt-4">1. Acceptance of Terms</h4>
    <p>
      By accessing or using Kainetic, you agree to be bound by these Terms of Service.
      We may update these terms periodically, and continued use of the dashboard constitutes acceptance of the updated terms.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">2. No Affiliation with Strava</h4>
    <p>
      Kainetic is an independent, third-party application and is not affiliated with, endorsed by, or sponsored by Strava, Inc.
      The &quot;Powered by Strava&quot; logo indicates only that we utilize the Strava API to provide this service.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">3. Use at Your Own Risk</h4>
    <p>
      The dashboard is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
      We make no warranties regarding the accuracy, reliability, or availability of the service. 
      We are not liable for any data discrepancies, service interruptions, or damages arising from the use of this dashboard.
      Vercel Web Analytics is anonymous and does not track personal Strava data.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">4. User Responsibilities</h4>
    <p>
      You are responsible for maintaining the security of your Strava account credentials.
      You agree not to use this service for any illegal or unauthorized purpose and to comply with Strava’s API Terms.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">5. Intellectual Property</h4>
    <p>
      All website content, design, and code for Kainetic are owned by the developer.
      You may not copy, redistribute, or reproduce any part of the dashboard without permission.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">6. Governing Law</h4>
    <p>
      These Terms are governed by the laws of <strong>[your country/region]</strong>, without regard to conflict of law principles.
    </p>

    <h4 className="text-slate-900 font-bold text-base mt-4">7. Contact Information</h4>
    <p>
      For questions about these Terms of Service, please contact us at:
      <br />
      <strong>[your email here]</strong>
    </p>
  </div>
);