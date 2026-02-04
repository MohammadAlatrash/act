import { Task, StrategicGoal } from '../types';

export type SovereignRank = 'Novice' | 'Vanguard' | 'Strategist' | 'Grandmaster' | 'Sovereign';

export interface RankStats {
    score: number;
    rank: SovereignRank;
    nextRankProgress: number;
}

export function calculateSovereignRank(tasks: Task[], habits: any[]): RankStats {
    let score = 0;

    // Points for completed tasks
    const completedTasks = tasks.filter(t => t.status === 'Completed');
    score += completedTasks.length * 50;

    // Bonus for strategic alignment (linked tasks)
    const linkedTasks = completedTasks.filter(t => !!t.goalId);
    score += linkedTasks.length * 30;

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
