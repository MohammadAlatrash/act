import { Task, TimeEntry, DailyBioState, EnergyLevel } from '../types';
import { calculateDailyAnchors } from './anchors';

/**
 * Identifies "Golden Hours" where task completion velocity is highest.
 */
export const identifyGoldenHours = (timeEntries: TimeEntry[]): string[] => {
    // Simplified logic: finds hours with the most 'Focus' duration
    const hourMap: Record<number, number> = {};

    timeEntries.filter(te => te.category === 'Focus' && te.durationMinutes).forEach(te => {
        const startHour = new Date(te.startTime).getHours();
        hourMap[startHour] = (hourMap[startHour] || 0) + te.durationMinutes!;
    });

    return Object.entries(hourMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => `${hour}:00`);
};

/**
 * Predicts the probability of failure for a planned day.
 */
export const predictFailureProbability = (tasks: Task[], bioState: DailyBioState): number => {
    let riskScore = 0;

    // Risk 1: High task density vs Bio-energy
    const totalEstimated = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    if (totalEstimated > 8 && bioState.avgEnergy < 60) riskScore += 0.4;

    // Risk 2: Sleep quality correlation
    if (bioState.sleepQuality < 50) riskScore += 0.3;

    // Risk 3: Mood Impact
    if (bioState.mood === 'Burnout') riskScore += 0.5;
    if (bioState.mood === 'Foggy') riskScore += 0.2;

    // Risk 4: Historical deferral rate
    const deferralRate = tasks.reduce((sum, t) => sum + (t.deferralHistory?.length || 0), 0) / (tasks.length || 1);
    riskScore += Math.min(0.2, deferralRate * 0.1);

    return Math.min(1, riskScore);
};

/**
 * Suggests a recovery protocol based on work intensity and biological state.
 */
export const suggestRecoveryAction = (focusMinutesToday: number, bioState: DailyBioState): string | null => {
    if (focusMinutesToday > 180 || bioState.mood === 'Burnout') {
        return "Critical Recharge Required: 15min Digital Fast or Physical Movement.";
    }
    if (bioState.mood === 'Foggy' || bioState.avgEnergy < 40) {
        return "Energy Dip Detected: Consider 'Endel-Relax' protocol for 10 mins.";
    }
    return null;
};

/**
 * Maps energy levels to numeric values for calculation.
 */
export const energyToValue = (level: EnergyLevel): number => {
    const map: Record<EnergyLevel, number> = {
        'Peak': 100,
        'High': 80,
        'Moderate': 60,
        'Low': 40,
        'Drained': 10
    };
    return map[level];
};

/**
 * Detects if a time entry is within a high-barakah window.
 */
export const getBarakahMultiplier = (startTime: string): number => {
    const anchors = calculateDailyAnchors();
    const start = new Date(startTime);
    const startHour = start.getHours();
    const startMinutes = start.getMinutes();
    const totalStartMinutes = startHour * 60 + startMinutes;

    for (const anchor of anchors) {
        const [aHour, aMin] = anchor.time.split(':').map(Number);
        const anchorMinutes = aHour * 60 + aMin;

        // Window is 60-120 minutes post-anchor
        const diff = totalStartMinutes - anchorMinutes;
        if (diff >= 0 && diff <= 120) {
            if (anchor.id === 'fajr') return 2.0; // Bakoor bonus
            return 1.5; // Post-Salah alignment
        }
    }

    return 1.0;
};

/**
 * Calculates the total Athar-Score (AS) for a set of tasks and time entries.
 * AS = Sum(BaseWeight * L * P * B)
 */
export const calculateAtharScore = (tasks: Task[], timeEntries: TimeEntry[]): number => {
    let totalScore = 0;

    tasks.forEach(task => {
        const taskEntries = timeEntries.filter(te => te.taskId === task.id);
        const legacyWeight = (task.legacyScore || 50) / 100; // Map 0-100 to 0.1-1.0 (clamped)
        const L = Math.max(0.1, Math.min(1.0, legacyWeight));

        taskEntries.forEach(entry => {
            const baseWeight = (entry.durationMinutes || 0) / 60; // Use hours as base weight
            const P = entry.presenceScore || 3; // Default to neutral presence
            const B = entry.barakahMultiplier || getBarakahMultiplier(entry.startTime);

            totalScore += baseWeight * L * P * B;
        });
    });

    return Math.round(totalScore);
};

/**
 * Projects future "Athar" (Legacy) impact based on current velocity and impact weighting.
 */
export const calculateLegacyProjection = (tasks: Task[], currentScore: number): { time: string; impact: number }[] => {
    const projection: { time: string; impact: number }[] = [];
    const completedTasks = tasks.filter(t => t.status === 'Completed');
    const avgImpact = completedTasks.length > 0
        ? completedTasks.reduce((sum, t) => sum + (t.legacyScore || 50), 0) / completedTasks.length
        : 50;

    const velocity = completedTasks.length / 7; // Average tasks per day (mocked for week)

    for (let i = 1; i <= 6; i++) {
        const monthsInFuture = i * 2;
        const projectedGrowth = currentScore + (avgImpact * velocity * monthsInFuture * 1.2);
        projection.push({
            time: `+${monthsInFuture}m`,
            impact: Math.min(10000, Math.round(projectedGrowth)) // Cap for scale
        });
    }

    return projection;
};
