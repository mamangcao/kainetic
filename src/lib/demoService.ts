// src/lib/demoService.ts
import { 
  AthleteProfile, 
  BestEffort, 
  ChartPoint, 
  StatsData, 
  Trophy, 
  SportType, 
  ActivityHighlight, 
  WeeklyStoryData 
} from '@/types'; // <--- UPDATED IMPORT

// Reduced delays for better UX in Next.js
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms / 2));

export const getAthleteProfile = async (): Promise<AthleteProfile> => {
  await delay(400);
  return {
    id: 'demo_guest',
    username: 'guest_user',
    firstname: 'Guest',
    lastname: 'Athlete',
    bio: 'Just exploring Kainetic. Casual runner and weekend cyclist. Looking to improve consistency!',
    profile_medium: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=200&q=80',
    city: 'Demo City',
    country: 'Virtual Land'
  };
};

export const getStats = async (sport: SportType): Promise<StatsData> => {
  await delay(600);
  const multipliers: Record<string, number> = { running: 1, walking: 0.5, cycling: 3 };
  const m = multipliers[sport] || 1;

  const calculateGrowth = (total: number, ytd: number) => {
    const previousTotal = total - ytd;
    if (previousTotal <= 0) return 100; 
    return parseFloat(((ytd / previousTotal) * 100).toFixed(1));
  };
  
  const calculateSteps = (km: number) => sport === 'walking' ? Math.floor(km * 1350) : undefined;

  const distAll = Math.floor(450 * m);
  const distYtd = Math.floor(150 * m);
  
  const actsAll = Math.floor(85 * m);
  const actsYtd = Math.floor(25 * m);
  
  const elevAll = Math.floor(1200 * m);
  const elevYtd = Math.floor(800 * m);

  const timeAllVal = sport === 'cycling' ? 45.3 : 32.75;
  const timeYtdVal = sport === 'cycling' ? 15.3 : 12.75;

  const stepsAll = calculateSteps(distAll);
  const stepsYtd = calculateSteps(distYtd);

  const distThisWeek = parseFloat((15.5 * m).toFixed(1));
  const distThisMonth = parseFloat((65.2 * m).toFixed(1));

  const generateTime = (baseMin: number, variance: number) => {
    const totalMin = baseMin + (Math.random() * variance * 2 - variance);
    const hrs = Math.floor(totalMin / 60);
    const mins = Math.floor(totalMin % 60);
    const secs = Math.floor(Math.random() * 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getHighlights = (period: 'week' | 'month'): ActivityHighlight[] => {
    const isWeek = period === 'week';
    const dist = isWeek ? distThisWeek : distThisMonth;
    const v = isWeek ? 3 : 6; 

    if (sport === 'walking') {
      const steps = Math.floor(dist * 1350).toLocaleString();
      const paceM = 11 + Math.floor(Math.random() * 2);
      const paceS = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      const avgPace = `${paceM}:${paceS} /km`;
      const maxPossibleSingle = Math.min(dist, 10);
      const longest = (Math.random() * maxPossibleSingle * 0.8 + 1).toFixed(1);
      const calories = Math.floor(dist * 60).toLocaleString();

      return [
        { label: 'Total Steps', value: steps, icon: 'footprints' },
        { label: 'Total Distance', value: `${dist} km`, icon: 'map' },
        { label: 'Avg Pace', value: avgPace, icon: 'timer' },
        { label: 'Longest Walk', value: `${longest} km`, icon: 'map' },
        { label: 'Calories Burned', value: `${calories} kcal`, icon: 'flame' }
      ];
    }

    if (sport === 'cycling') {
      const speed = (24 + Math.random() * 10).toFixed(1);
      const t5 = 9;
      const t10 = 20;
      const t15 = 32;
      const t21 = 45;

      return [
        { label: 'Total Distance', value: `${dist} km`, icon: 'map' },
        { label: 'Avg Speed', value: `${speed} km/h`, icon: 'zap' },
        { label: 'Fastest 5km', value: generateTime(t5, v), icon: 'timer' },
        { label: 'Fastest 10km', value: generateTime(t10, v), icon: 'timer' },
        { label: 'Fastest 15km', value: generateTime(t15, v), icon: 'timer' },
        { label: 'Fastest 21km', value: generateTime(t21, v), icon: 'timer' }
      ];
    }

    const distBase = isWeek ? 32 : 110;
    const longestVal = `${(distBase * (0.8 + Math.random() * 0.4)).toFixed(1)} km`;
    const pm = 5 + Math.floor(Math.random() * 2);
    const ps = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    const paceVal = `${pm}:${ps} /km`;
    const t5 = 24;
    const t10 = 50;
    const t15 = 78;
    const t21 = 110;

    return [
      { label: 'Longest Run', value: longestVal, icon: 'map' },
      { label: 'Avg Pace', value: paceVal, icon: 'timer' },
      { label: 'Fastest 5km', value: generateTime(t5, v), icon: 'timer' },
      { label: 'Fastest 10km', value: generateTime(t10, v), icon: 'timer' },
      { label: 'Fastest 15km', value: generateTime(t15, v), icon: 'timer' },
      { label: 'Fastest 21km', value: generateTime(t21, v), icon: 'timer' }
    ];
  };

  return {
    allTime: {
      activities: actsAll,
      distance: distAll,
      time: sport === 'cycling' ? '45h 20m' : '32h 45m',
      elevation: elevAll,
      steps: stepsAll,
      growth: {
        distance: calculateGrowth(distAll, distYtd),
        activities: calculateGrowth(actsAll, actsYtd),
        elevation: calculateGrowth(elevAll, elevYtd),
        time: calculateGrowth(timeAllVal, timeYtdVal),
        steps: stepsAll && stepsYtd ? calculateGrowth(stepsAll, stepsYtd) : undefined
      }
    },
    ytd: {
      activities: actsYtd,
      distance: distYtd,
      time: sport === 'cycling' ? '15h 20m' : '12h 45m',
      elevation: elevYtd,
      steps: stepsYtd,
      trends: {
        activities: 5,
        distance: 12,
        time: 8,
        elevation: -2,
        steps: 12
      }
    },
    recent: {
      thisWeek: { 
        activities: 3,
        distance: distThisWeek,
        time: `${Math.floor(distThisWeek / 9)}h ${Math.floor((distThisWeek % 9) * 6)}m`,
        elevation: Math.floor(distThisWeek * 10),
        steps: calculateSteps(distThisWeek),
        highlights: getHighlights('week')
      },
      thisMonth: { 
        activities: 12,
        distance: distThisMonth,
        time: `${Math.floor(distThisMonth / 9)}h ${Math.floor((distThisMonth % 9) * 6)}m`,
        elevation: Math.floor(distThisMonth * 8),
        steps: calculateSteps(distThisMonth),
        highlights: getHighlights('month')
      }
    }
  };
};

export const getWeeklyStory = async (sport: SportType): Promise<WeeklyStoryData> => {
  await delay(700);
  
  if (sport === 'cycling') {
    return {
      summary: "Looks like you're putting in some serious mileage! The AI detected a strong improvement in your climbing speed this week. Keep up this momentum.",
      insights: [
        { label: "Best 5 Min Power", value: "280W", detail: "Maintained during Saturday's ride", icon: "zap", color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
        { label: "Toughest Climb", value: "320m", detail: "Avg 7% grade • Peak HR 175", icon: "mountain", color: "text-red-400", bgColor: "bg-red-500/10" },
        { label: "Most Improved", value: "Cadence", detail: "Avg 85rpm (+5 vs last week)", icon: "trending-up", color: "text-green-400", bgColor: "bg-green-500/10" },
        { label: "Weather Hero", value: "Windy", detail: "Battled 30km/h gusts on Tuesday", icon: "wind", color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
      ]
    };
  }

  if (sport === 'walking') {
    return {
      summary: "Slow and steady wins the race. You've been extremely consistent with your daily steps. That long walk on Sunday really boosted your weekly total.",
      insights: [
        { label: "Top Step Count", value: "15,200", detail: "Sunday • Nature Trail", icon: "footprints", color: "text-orange-400", bgColor: "bg-orange-500/10" },
        { label: "Active Time", value: "5h 30m", detail: "Total duration this week", icon: "heart", color: "text-pink-400", bgColor: "bg-pink-500/10" },
        { label: "Consistency", value: "High", detail: "Active 6 out of 7 days", icon: "trending-up", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
        { label: "Discovery", value: "New Route", detail: "Explored 'River Path' segment", icon: "map", color: "text-blue-400", bgColor: "bg-blue-500/10" },
      ]
    };
  }

  return {
    summary: "You're building a great base. The AI analysis shows your average heart rate at 5:30/km pace has dropped, meaning you're getting fitter and more efficient.",
    insights: [
      { label: "Fastest Mile", value: "7:15", detail: "Mile 2 of Wed Tempo", icon: "zap", color: "text-lime-400", bgColor: "bg-lime-500/10" },
      { label: "Efficiency", value: "+3%", detail: "Lower HR at aerobic pace", icon: "heart", color: "text-rose-400", bgColor: "bg-rose-500/10" },
      { label: "Hardest Effort", value: "Intervals", detail: "4x 800m at track pace", icon: "gauge", color: "text-indigo-400", bgColor: "bg-indigo-500/10" },
      { label: "Weather Hero", value: "Rain", detail: "Completed run in heavy rain", icon: "cloud-rain", color: "text-slate-300", bgColor: "bg-slate-500/20" },
    ]
  };
};

export const getActivitiesHeatmap = async (sport: SportType): Promise<number[]> => {
  await delay(800);
  return Array.from({ length: 365 }, () => {
    const chance = Math.random();
    return chance > 0.85 ? Math.ceil(Math.random() * 3) : 0;
  });
};

export const getChartData = async (sport: SportType, period: 'week' | 'month'): Promise<ChartPoint[]> => {
  await delay(500);
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const getActivities = (dist: number, p: 'week'|'month') => {
      const perAct = sport === 'cycling' ? 25 : (sport === 'walking' ? 3 : 6);
      let count = Math.ceil(dist / perAct);
      if (count < 1) count = 1;
      return count + Math.floor(Math.random() * 2);
  };
  
  const getElevation = (dist: number) => Math.floor(dist * (sport === 'cycling' ? 10 : 6) + Math.random() * 30);
  
  const getTime = (dist: number) => {
      const speed = sport === 'cycling' ? 24 : (sport === 'walking' ? 5 : 9); // km/h
      const hoursDecimal = dist / speed;
      const h = Math.floor(hoursDecimal);
      const m = Math.round((hoursDecimal - h) * 60);
      return `${h}h ${m}m`;
  };

  if (period === 'week') {
    const weeks: ChartPoint[] = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const diffToMonday = (dayOfWeek + 6) % 7;
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - diffToMonday);
    thisWeekStart.setHours(0,0,0,0);

    for (let i = 11; i >= 0; i--) {
      const start = new Date(thisWeekStart);
      start.setDate(start.getDate() - (i * 7));
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      const startStr = formatDate(start);
      const endStr = formatDate(end);
      
      const dist = Math.floor(Math.random() * (sport === 'cycling' ? 150 : 50)) + 10;
      
      weeks.push({
        name: startStr,
        value: dist,
        range: `${startStr} - ${endStr}`,
        activities: getActivities(dist, 'week'),
        elevation: getElevation(dist),
        time: getTime(dist),
        steps: sport === 'walking' ? Math.floor(dist * 1350) : undefined
      });
    }
    return weeks;
  } else {
    const monthsData: ChartPoint[] = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = d.toLocaleDateString('en-US', { month: 'short' });
        
        const dist = Math.floor(Math.random() * (sport === 'cycling' ? 600 : 150)) + 50;

        monthsData.push({
            name: monthName,
            value: dist,
            range: `${monthName} ${d.getFullYear()}`,
            activities: getActivities(dist, 'month'),
            elevation: getElevation(dist),
            time: getTime(dist),
            steps: sport === 'walking' ? Math.floor(dist * 1350) : undefined
        });
    }
    return monthsData;
  }
};

export const getTrophies = async (sport: SportType): Promise<Trophy[]> => {
  await delay(700);
  return [
    { id: 'd1', name: 'First Steps', date: '2024-05-01', icon: '👟' },
    { id: 'd2', name: 'Week Streak', date: '2024-05-10', icon: '🔥' },
  ];
};

export const getBestEfforts = async (sport: SportType): Promise<BestEffort[]> => {
  await delay(600);
  return []; 
};