import { Task } from '../types';

/**
 * Calculates the average remaining hours per day to achieve a task before its deadline.
 */
export const calculateRemainingVelocity = (task: Task): number => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return task.estimatedHours - task.actualHours;

    const remainingHours = Math.max(0, task.estimatedHours - task.actualHours);
    return Number((remainingHours / diffDays).toFixed(2));
};

/**
 * Splits a complex thought or project into a set of structured tasks.
 * (Simplified placeholder for AI-driven task splitting logic)
 */
export const decomposeProject = (input: string): Partial<Task>[] => {
    // In a real scenario, this would call an AI endpoint.
    // For now, it provides a structured scaffold.
    return [
        { title: 'Research & Definition', estimatedHours: 2, priority: 'High' },
        { title: 'Implementation Phase 1', estimatedHours: 5, priority: 'Medium' },
        { title: 'Review & Polish', estimatedHours: 3, priority: 'Medium' },
    ];
};
