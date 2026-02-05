export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type Status = 'Pending' | 'In Progress' | 'Completed' | 'Deferred';

export type EnergyLevel = 'Peak' | 'High' | 'Moderate' | 'Low' | 'Drained';
export type Mood = 'Radiant' | 'Steady' | 'Foggy' | 'Burnout';
export type DeferralReason = 'Distraction' | 'Emergency' | 'Over-estimated' | 'Energy Crash' | 'Higher Priority' | 'Other';

export interface DailyBioState {
  date: string;
  energyGraph: { time: string; level: EnergyLevel }[];
  avgEnergy: number;
  sleepQuality: number; // 0-100
  mood?: Mood;
  falahScore?: number; // 0-100 (Overall success/alignment)
}

export interface RecoveryTask {
  id: string;
  type: 'Endel-Focus' | 'Endel-Relax' | 'Endel-Sleep' | 'Physical' | 'Digital Fast';
  durationMinutes: number;
  reason: string;
}

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

export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: string; // ISO string
  endTime?: string;  // ISO string
  durationMinutes?: number;
  note?: string;
  category: 'Focus' | 'Meeting' | 'Break' | 'Admin' | 'Unscheduled' | 'Leakage';
  auditStatus: 'Audited' | 'Pending';
  presenceScore?: number; // 1-5 (Presence/Khushu)
  barakahMultiplier?: number; // x1.0, x1.5, x2.0
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
  isAtomic?: boolean; // Two-Minute Rule
  deadline: string; // ISO string
  subtasks: Subtask[];
  timeEntries: string[]; // TimeEntry IDs
  deferralHistory: { date: string; reason: DeferralReason; note?: string }[];
  legacyScore: number; // 0-100 (Impact Weighting)
  anchorId?: string; // Link to a SovereignAnchor
  intentTag?: 'Ihsan' | 'Nafa' | 'Rizq' | 'Itqan'; // Intent Alignment
  presenceAverage?: number; // Avg 1-5
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
  status: 'Active' | 'Achieved' | 'Deferred';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  goalId: string;
  tasks: string[]; // Task IDs
  status: 'Active' | 'Completed' | 'On Hold';
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  legacyPotential: number; // 0-100 placeholder
  status: 'Captures' | 'Processed' | 'Discarded';
}

export interface SovereignAnchor {
  id: string;
  name: string;
  startTime: string; // "HH:mm"
  durationMinutes: number;
  type: 'Spiritual' | 'Biological' | 'Social' | 'Other';
  icon?: string;
}
