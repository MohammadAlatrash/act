import { Task, StrategicGoal } from '../types';
import { calculateAtharScore } from './intelligence';

export type SovereignRank = 'Novice' | 'Vanguard' | 'Strategist' | 'Grandmaster' | 'Sovereign';

export interface RankStats {
    score: number;
    rank: SovereignRank;
    nextRankProgress: number;
}

export function calculateSovereignRank(tasks: Task[], habits: any[]): RankStats {
    let score = 0;

    // Use calculateAtharScore as the primary driver for ranking
    // Since AtharScore depends on time entries, we'll need to mock/pass them here
    // or keep the basic task-based score as a foundation and add AS to it.

    // For now, let's assume we have a global set of timeEntries (mocked for rank calculation)
    // or we use the legacyScore directly as a weighting factor for simple completion.

    tasks.filter(t => t.status === 'Completed').forEach(t => {
        const base = 50;
        const legacyWeight = (t.legacyScore || 50) / 100;
        const presenceBonus = t.presenceAverage || 1;

        score += base * legacyWeight * presenceBonus;
    });

    // Points for habit streaks
    habits.forEach(h => {
        score += h.streak * 10;
    });

    let rank: SovereignRank = 'Novice';
    let nextRankThreshold = 500;
    let prevRankThreshold = 0;

    if (score >= 2500) {
        rank = 'Sovereign';
        prevRankThreshold = 2500;
        nextRankThreshold = 5000; // Mastery limit
    } else if (score >= 1200) {
        rank = 'Grandmaster';
        prevRankThreshold = 1200;
        nextRankThreshold = 2500;
    } else if (score >= 500) {
        rank = 'Strategist';
        prevRankThreshold = 500;
        nextRankThreshold = 1200;
    } else if (score >= 150) {
        rank = 'Vanguard';
        prevRankThreshold = 150;
        nextRankThreshold = 500;
    }

    const progress = Math.min(100, ((score - prevRankThreshold) / (nextRankThreshold - prevRankThreshold)) * 100);

    return { score, rank, nextRankProgress: progress };
}
