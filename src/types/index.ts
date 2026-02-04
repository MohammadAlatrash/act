export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type Status = 'Pending' | 'In Progress' | 'Completed' | 'Deferred';

export interface Habit {
  id: string;
  name: string;
  targetCount: number;
  currentCount: number;
  unit: string;
  frequency: 'Daily' | 'Weekly';
  streak: number;
}

export interface SleepRecord {
  id: string;
  date: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  stages: {
    remSeconds: number;
    deepSeconds: number;
    lightSeconds: number;
  };
  totalMinutes: number;
}

export interface Task {
  id: string;
  goalId?: string; // Strategic linking
  title: string;
  description: string;
  projectId?: string;
  priority: Priority;
  status: Status;
  estimatedHours: number;
  actualHours: number;
  deadline: string; // ISO string
  subtasks: Subtask[];
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  estimatedMinutes: number;
}

export interface StrategicGoal {
  id: string;
  title: string;
  type: 'Yearly' | 'Quarterly' | 'Monthly';
  targetDate: string;
  progress: number; // 0-100
  projects: string[]; // Project IDs
}

export interface Project {
  id: string;
  name: string;
  description: string;
  goalId: string;
  tasks: string[]; // Task IDs
}
