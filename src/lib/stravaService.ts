import {
  AthleteProfile,
  BestEffort,
  ChartPoint,
  StatsData,
  Trophy,
  SportType,
  ActivityHighlight,
  WeeklyStoryData,
  HeatmapPoint,
  Insight,
} from "../types";
import { stravaFetch } from "./stravaApi";

// Internal types for Strava API responses
interface StravaActivity {
  id: number;
  type: string;
  start_date_local: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  [key: string]: unknown; // Allow other properties safely
}

interface InternalChartPoint extends ChartPoint {
  _rawTime: number;
  _startDate: Date;
  _endDate: Date;
}

interface StatsAccumulator {
  dist: number;
  time: number;
  elev: number;
  count: number;
}

interface BestsTracker {
  longestDist: number;
  biggestClimb: number;
  bestEfforts: Record<number, number | null>;
}

export const getAthleteProfile = async (): Promise<AthleteProfile> => {
  const data = await stravaFetch("/athlete");
  return {
    id: data.id.toString(),
    username: data.username || data.firstname,
    firstname: data.firstname,
    lastname: data.lastname,
    bio: data.bio || "Strava Athlete",
    profile_medium: data.profile_medium,
    city: data.city || null,
    country: data.country || null,
  };
};

export const getStats = async (sport: SportType): Promise<StatsData> => {
  const athlete = JSON.parse(localStorage.getItem("strava_athlete") || "{}");

  // Parallel fetch: stats totals AND recent activities for accurate weekly/monthly data
  // Increased to 200 to attempt to cover "Last Year YTD" for trend calculation
  const [data, activities] = await Promise.all([
    stravaFetch(`/athletes/${athlete.id}/stats`),
    stravaFetch("/athlete/activities?per_page=200"),
  ]);

  // Mapping Strava's specific metric structure to our UI types
  const prefix =
    sport === "cycling" ? "ride" : sport === "walking" ? "walk" : "run";

  const all = data[`all_${prefix}_totals`];
  const ytd = data[`ytd_${prefix}_totals`];

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0)
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const calculatePace = (dist: number, time: number) => {
    if (dist === 0 || time === 0) return "0:00 /km";
    const speed = dist / time; // m/s
    if (sport === "cycling") {
      return `${(speed * 3.6).toFixed(1)} km/h`;
    }
    const paceSeconds = 1000 / speed;
    const pM = Math.floor(paceSeconds / 60);
    const pS = Math.floor(paceSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${pM}:${pS} /km`;
  };

  const calculateGrowth = (current: number, total: number) => {
    if (total === 0) return 0;
    return parseFloat(((current / total) * 100).toFixed(1));
  };

  // --- Calculate Actual "This Week" and "This Month" ---
  const now = new Date();

  // Start of Week (Monday)
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay(); // 0 (Sun) to 6 (Sat)
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Start of Month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Start of Last Year Comparison (for Trends)
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
  const endOfLastYearComparison = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  // Initialize accumulators
  const weekStats: StatsAccumulator = { dist: 0, time: 0, elev: 0, count: 0 };
  const monthStats: StatsAccumulator = { dist: 0, time: 0, elev: 0, count: 0 };
  const lastYearStats: StatsAccumulator = {
    dist: 0,
    time: 0,
    elev: 0,
    count: 0,
  };

  // Targets for "Fastest X"
  let targets: number[] = [];
  let targetLabels: Record<number, string> = {};

  if (sport === "cycling") {
    targets = [10000, 20000, 30000, 40000, 50000];
    targetLabels = {
      10000: "Fastest 10km",
      20000: "Fastest 20km",
      30000: "Fastest 30km",
      40000: "Fastest 40km",
      50000: "Fastest 50km",
    };
  } else {
    targets = [5000, 10000, 15000, 21097, 30000, 42195]; // meters
    targetLabels = {
      5000: "Fastest 5km",
      10000: "Fastest 10km",
      15000: "Fastest 15km",
      21097: "Fastest Half Marathon",
      30000: "Fastest 30km",
      42195: "Fastest Marathon",
    };
  }

  // Tracking Object
  const createTracker = (): BestsTracker => ({
    longestDist: 0,
    biggestClimb: 0,
    bestEfforts: {} as Record<number, number | null>,
  });

  const weekBests = createTracker();
  const monthBests = createTracker();

  // Filter activities by sport
  const relevantActivities = (activities as StravaActivity[]).filter((act) => {
    const type = act.type;
    if (sport === "running") return type === "Run";
    if (sport === "cycling")
      return type === "Ride" || type === "VirtualRide" || type === "EBikeRide";
    if (sport === "walking") return type === "Walk" || type === "Hike";
    return false;
  });

  const processActivity = (
    act: StravaActivity,
    stats: StatsAccumulator,
    bests?: BestsTracker
  ) => {
    stats.dist += act.distance;
    stats.time += act.moving_time;
    stats.elev += act.total_elevation_gain;
    stats.count++;

    if (bests) {
      // Longest Run/Ride
      if (act.distance > bests.longestDist) {
        bests.longestDist = act.distance;
      }

      // Biggest Climb
      if (act.total_elevation_gain > bests.biggestClimb) {
        bests.biggestClimb = act.total_elevation_gain;
      }

      // Check Best Efforts
      targets.forEach((target) => {
        if (act.distance >= target) {
          const estimatedTime = (act.moving_time / act.distance) * target;
          if (
            bests.bestEfforts[target] === undefined ||
            bests.bestEfforts[target] === null ||
            estimatedTime < bests.bestEfforts[target]!
          ) {
            bests.bestEfforts[target] = estimatedTime;
          }
        }
      });
    }
  };

  relevantActivities.forEach((act) => {
    const actDate = new Date(act.start_date_local);
    if (actDate >= startOfWeek) processActivity(act, weekStats, weekBests);
    if (actDate >= startOfMonth) processActivity(act, monthStats, monthBests);

    // Accumulate Last Year Stats for Trend
    if (actDate >= startOfLastYear && actDate <= endOfLastYearComparison) {
      processActivity(act, lastYearStats); // No bests tracking needed for trend
    }
  });

  const hasFullLastYearData =
    activities.length < 200 ||
    (relevantActivities.length > 0 &&
      new Date(
        relevantActivities[relevantActivities.length - 1].start_date_local
      ) <= startOfLastYear);

  const calculateTrend = (current: number, prev: number) => {
    if (!hasFullLastYearData) return undefined; 
    if (prev === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - prev) / prev) * 100).toFixed(1));
  };

  const generateHighlights = (
    stats: StatsAccumulator,
    bests: BestsTracker
  ): ActivityHighlight[] => {
    const items: ActivityHighlight[] = [];

    items.push({
      label:
        sport === "cycling"
          ? "Longest Ride"
          : sport === "walking"
          ? "Longest Walk"
          : "Longest Run",
      value: `${(bests.longestDist / 1000).toFixed(1)} km`,
      icon: "map",
    });

    if (sport === "cycling") {
      items.push({
        label: "Biggest Climb",
        value: `${Math.round(bests.biggestClimb)} m`,
        icon: "mountain",
      });
      items.push({
        label: "Elevation Gain",
        value: `${Math.round(stats.elev)} m`,
        icon: "trending-up",
      });
    } else {
      items.push({
        label: "Avg Pace",
        value: calculatePace(stats.dist, stats.time),
        icon: "timer",
      });
    }

    targets.forEach((target) => {
      const time = bests.bestEfforts[target];
      items.push({
        label: targetLabels[target],
        value: time ? formatDuration(time) : "0:00", // Show 0:00 if no data
        icon: "timer",
      });
    });

    return items;
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
      },
    },
    ytd: {
      activities: ytd.count,
      distance: Math.floor(ytd.distance / 1000),
      time: formatTime(ytd.moving_time),
      elevation: ytd.elevation_gain,
      trends: {
        activities: calculateTrend(ytd.count, lastYearStats.count)!,
        distance: calculateTrend(ytd.distance, lastYearStats.dist)!,
        time: calculateTrend(ytd.moving_time, lastYearStats.time)!,
        elevation: calculateTrend(ytd.elevation_gain, lastYearStats.elev)!,
      },
    },
    recent: {
      thisWeek: {
        activities: weekStats.count,
        distance: parseFloat((weekStats.dist / 1000).toFixed(1)),
        time: formatTime(weekStats.time),
        elevation: weekStats.elev,
        highlights: generateHighlights(weekStats, weekBests),
      },
      thisMonth: {
        activities: monthStats.count,
        distance: parseFloat((monthStats.dist / 1000).toFixed(1)),
        time: formatTime(monthStats.time),
        elevation: monthStats.elev,
        highlights: generateHighlights(monthStats, monthBests),
      },
    },
  };
};

export const getStory = async (
  sport: SportType,
  period: "week" | "month"
): Promise<WeeklyStoryData> => {
  // Fetch recent activities (enough to cover the period)
  const activities = await stravaFetch("/athlete/activities?per_page=100");

  // Define "Start Date"
  const now = new Date();
  const startOfPeriod = new Date(now);

  if (period === "week") {
    const day = startOfPeriod.getDay();
    const diff = startOfPeriod.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    startOfPeriod.setDate(diff);
  } else {
    startOfPeriod.setDate(1); // 1st of the month
  }
  startOfPeriod.setHours(0, 0, 0, 0);

  // Filter and Aggregate
  const relevantActivities = (activities as StravaActivity[]).filter((act) => {
    const actDate = new Date(act.start_date_local);
    if (actDate < startOfPeriod) return false;

    const type = act.type;
    if (sport === "running") return type === "Run";
    if (sport === "cycling")
      return type === "Ride" || type === "VirtualRide" || type === "EBikeRide";
    if (sport === "walking") return type === "Walk" || type === "Hike";
    return false;
  });

  const stats = {
    count: 0,
    distance: 0, // meters
    elevation: 0, // meters
    time: 0, // seconds
    maxDist: 0,
    maxElev: 0,
  };

  relevantActivities.forEach((act) => {
    stats.count++;
    stats.distance += act.distance;
    stats.elevation += act.total_elevation_gain;
    stats.time += act.moving_time;
    if (act.distance > stats.maxDist) stats.maxDist = act.distance;
    if (act.total_elevation_gain > stats.maxElev)
      stats.maxElev = act.total_elevation_gain;
  });

  // Generate Insights
  const insights: Insight[] = [];
  const periodLabel = period === "week" ? "week" : "month";

  if (stats.count === 0) {
    return {
      summary: `No ${sport} activities recorded this ${periodLabel} yet. Time to get out there and start your streak!`,
      insights: [
        {
          label: "Status",
          value: `Rest ${periodLabel === "week" ? "Week" : "Month"}`,
          detail: "Ready to go?",
          icon: "coffee",
          color: "text-slate-400",
          bgColor: "bg-slate-500/10",
        },
      ],
    };
  }

  // Common Insight: Total Distance
  insights.push({
    label: `${period === "week" ? "Weekly" : "Monthly"} Volume`,
    value: `${(stats.distance / 1000).toFixed(1)} km`,
    detail: `${stats.count} active days`,
    icon: "map",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  });

  // Sport-Specific Insights
  if (sport === "cycling") {
    insights.push({
      label: "Climbing",
      value: `${Math.round(stats.elevation)}m`,
      detail: "Elevation gained",
      icon: "mountain",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    });

    // Calculate Avg Speed
    const avgSpeed = (stats.distance / stats.time) * 3.6; // km/h
    insights.push({
      label: "Avg Speed",
      value: `${avgSpeed.toFixed(1)} km/h`,
      detail: "Across all rides",
      icon: "gauge",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    });

    insights.push({
      label: "Longest Ride",
      value: `${(stats.maxDist / 1000).toFixed(1)} km`,
      detail: "Your biggest effort",
      icon: "trophy",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    });
  } else if (sport === "running") {
    // Calculate Avg Pace
    const avgPaceSec = stats.time / (stats.distance / 1000); // sec per km
    const pM = Math.floor(avgPaceSec / 60);
    const pS = Math.floor(avgPaceSec % 60)
      .toString()
      .padStart(2, "0");

    insights.push({
      label: "Avg Pace",
      value: `${pM}:${pS} /km`,
      detail: `${period === "week" ? "Weekly" : "Monthly"} average`,
      icon: "gauge",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    });

    insights.push({
      label: "Longest Run",
      value: `${(stats.maxDist / 1000).toFixed(1)} km`,
      detail: "Endurance builder",
      icon: "trophy",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    });

    insights.push({
      label: "Time on Feet",
      value: `${Math.floor(stats.time / 3600)}h ${Math.round(
        (stats.time % 3600) / 60
      )}m`,
      detail: "Total duration",
      icon: "clock",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    });
  } else {
    // Walking
    // Estimate Steps (approx 1350 steps/km)
    const steps = Math.floor((stats.distance / 1000) * 1350);

    insights.push({
      label: "Total Steps",
      value: steps.toLocaleString(),
      detail: "~Estimated count",
      icon: "footprints",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    });

    insights.push({
      label: "Time Active",
      value: `${Math.floor(stats.time / 3600)}h ${Math.round(
        (stats.time % 3600) / 60
      )}m`,
      detail: "Fresh air time",
      icon: "heart",
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
    });

    insights.push({
      label: "Consistency",
      value: "Solid",
      detail: `${stats.count} walks logged`,
      icon: "trending-up",
      color: "text-teal-400",
      bgColor: "bg-teal-500/10",
    });
  }

  let summary = "";
  const distKm = (stats.distance / 1000).toFixed(1);

  if (sport === "cycling") {
    summary = `You've covered ${distKm} km over ${
      stats.count
    } rides this ${periodLabel}. ${
      stats.elevation > 500
        ? "Great climbing effort!"
        : "Nice consistent mileage."
    } Keep pushing those pedals!`;
  } else if (sport === "running") {
    summary = `Strong ${periodLabel} with ${distKm} km logged across ${
      stats.count
    } runs. ${
      stats.maxDist > 10000
        ? "That long run was impressive!"
        : "Consistency is key, keep it up!"
    }`;
  } else {
    summary = `You've been active with ${distKm} km of walking this ${periodLabel}. Taking time to move is the best investment in your health.`;
  }

  return {
    summary,
    insights,
  };
};

export const getActivitiesHeatmap = async (
  sport: SportType
): Promise<HeatmapPoint[]> => {
  const activities = await stravaFetch("/athlete/activities?per_page=200");

  const now = new Date();
  const yearData: HeatmapPoint[] = [];

  // Initialize last 365 days with 0 data
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    yearData.push({
      date: d.toISOString().split("T")[0], // YYYY-MM-DD
      distance: 0,
      intensity: 0,
    });
  }

  // Filter activities based on selected sport
  const relevantActivities = (activities as StravaActivity[]).filter((act) => {
    const type = act.type;
    if (sport === "running") return type === "Run";
    if (sport === "cycling")
      return type === "Ride" || type === "VirtualRide" || type === "EBikeRide";
    if (sport === "walking") return type === "Walk" || type === "Hike";
    return false;
  });

  // Map activities to dates using start_date_local
  relevantActivities.forEach((act) => {
    const actDateStr = act.start_date_local.split("T")[0];

    const dayStat = yearData.find((d) => d.date === actDateStr);

    if (dayStat) {
      dayStat.distance += act.distance;
    }
  });

  const divisor = sport === "cycling" ? 20000 : 5000; // 20km for cycling, 5km for run/walk

  yearData.forEach((d) => {
    if (d.distance > 0) {
      d.intensity = Math.min(4, Math.ceil(d.distance / divisor));
    }
  });

  return yearData;
};

export const getChartData = async (
  sport: SportType,
  period: "week" | "month"
): Promise<ChartPoint[]> => {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  const afterTimestamp = Math.floor(oneYearAgo.getTime() / 1000);

  const activities = await stravaFetch(
    `/athlete/activities?per_page=200&after=${afterTimestamp}`
  );

  // Filter by sport
  const relevantActivities = (activities as StravaActivity[]).filter((act) => {
    const type = act.type;
    if (sport === "running") return type === "Run";
    if (sport === "cycling")
      return type === "Ride" || type === "VirtualRide" || type === "EBikeRide";
    if (sport === "walking") return type === "Walk" || type === "Hike";
    return false;
  });

  const buckets: InternalChartPoint[] = [];
  const bucketCount = 12;

  // Helper to format duration
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  if (period === "week") {
    // Generate last 12 weeks (Monday to Sunday)
    // Start from the current week's Monday
    const currentWeekStart = new Date(now);
    const day = currentWeekStart.getDay();
    const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    currentWeekStart.setDate(diff);
    currentWeekStart.setHours(0, 0, 0, 0);

    for (let i = bucketCount - 1; i >= 0; i--) {
      const start = new Date(currentWeekStart);
      start.setDate(start.getDate() - i * 7);

      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      buckets.push({
        name: `W${12 - i}`,
        range: `${start.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })} - ${end.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}`,
        value: 0,
        activities: 0,
        time: "0h 0m", // placeholder
        elevation: 0,
        _rawTime: 0,
        _startDate: start,
        _endDate: end,
      });
    }

    buckets.forEach((b) => {
      b.name = b._startDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    });
  } else {
    // Generate last 12 months
    // Start from current month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    for (let i = bucketCount - 1; i >= 0; i--) {
      const start = new Date(currentMonthStart);
      start.setMonth(start.getMonth() - i);

      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // Last day of month
      end.setHours(23, 59, 59, 999);

      buckets.push({
        name: start.toLocaleDateString(undefined, { month: "short" }),
        range: start.toLocaleDateString(undefined, {
          month: "long",
          year: "numeric",
        }),
        value: 0,
        activities: 0,
        time: "0h 0m",
        elevation: 0,
        _rawTime: 0,
        _startDate: start,
        _endDate: end,
      });
    }
  }

  relevantActivities.forEach((act) => {
    const actDate = new Date(act.start_date_local);

    const bucket = buckets.find(
      (b) => actDate >= b._startDate && actDate <= b._endDate
    );

    if (bucket) {
      bucket.value += act.distance;
      bucket.activities = (bucket.activities || 0) + 1;
      bucket.elevation = (bucket.elevation || 0) + act.total_elevation_gain;
      bucket._rawTime += act.moving_time;
    }
  });

  // 6. Final Formatting
  return buckets.map((b) => ({
    name: b.name,
    range: b.range,
    value: parseFloat((b.value / 1000).toFixed(1)),
    activities: b.activities,
    time: formatTime(b._rawTime),
    elevation: Math.round(b.elevation || 0),
  }));
};

export const getTrophies = async (): Promise<Trophy[]> => {
  return [
    {
      id: "1",
      name: "Verified Athlete",
      date: new Date().toISOString().split("T")[0],
      icon: "✅",
    },
  ];
};

export const getBestEfforts = async (): Promise<BestEffort[]> => {
  return [];
};
