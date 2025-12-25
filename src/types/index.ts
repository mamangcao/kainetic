export type SportType = 'running' | 'walking' | 'cycling';

export interface StatItem {
  label: string;
  value: string;
  unit: string;
}

export interface StatMetrics {
  activities: number;
  distance: number;
  time: string;
  elevation: number;
  steps?: number;
}

export interface ActivityHighlight {
  label: string;
  value: string;
  icon?: string;
}

export interface StatsData {
  allTime: StatMetrics & {
    growth: {
      activities: number;
      distance: number;
      time: number;
      elevation: number;
      steps?: number;
    };
  };
  ytd: StatMetrics & {
    trends: {
      activities?: number;
      distance?: number;
      time?: number;
      elevation?: number;
      steps?: number;
    };
  };
  recent: {
    thisWeek: StatMetrics & {
      highlights: ActivityHighlight[];
    };
    thisMonth: StatMetrics & {
      highlights: ActivityHighlight[];
    };
  };
}

export interface Trophy {
  id: string;
  name: string;
  date: string;
  icon: string;
}

export interface Insight {
  label: string;
  value: string;
  detail: string;
  icon: string;
  color: string; // e.g., 'text-yellow-400'
  bgColor: string; // e.g., 'bg-yellow-500/10'
}

export interface WeeklyStoryData {
  summary: string;
  insights: Insight[];
}

export interface BestEffort {
  id: string; // Internal ID
  activityId: string; // Strava Activity ID for linking
  distance: string;
  time: string;
  date: string;
}

export interface ChartPoint {
  name: string;
  value: number;
  range?: string; // e.g., "Nov 30 - Dec 6"
  activities?: number;
  elevation?: number;
  time?: string;
  steps?: number;
}

export interface HeatmapPoint {
  date: string;
  distance: number;
  intensity: number;
}

export interface AthleteProfile {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  bio: string;
  profile_medium: string;
  city: string | null;
  country: string | null;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  tag: string;
  url?: string;
  rating?: number;
  sold?: number;
  stock?: number;
  productId?: string;
  fetchedAt?: string;
}