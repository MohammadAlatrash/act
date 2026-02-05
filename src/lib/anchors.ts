export interface AnchorPoint {
    id: string;
    name: string;
    time: string; // HH:mm
    type: 'Spirit' | 'Routine' | 'Focus';
}

/**
 * Provides placeholder Arabic cultural/spiritual anchors.
 * In a real scenario, this would use a library like 'adhaan' or an API.
 */
export const calculateDailyAnchors = (): AnchorPoint[] => {
    return [
        { id: 'fajr', name: 'Al-Fajr (Morning Anchor)', time: '05:15', type: 'Spirit' },
        { id: 'dhuhr', name: 'Al-Dhuhr (Mid-day Focus)', time: '12:15', type: 'Spirit' },
        { id: 'asr', name: 'Al-Asr (Afternoon Rebound)', time: '15:30', type: 'Spirit' },
        { id: 'maghrib', name: 'Al-Maghrib (Transition)', time: '17:45', type: 'Spirit' },
        { id: 'isha', name: 'Al-Isha (Shutdown Anchor)', time: '19:15', type: 'Spirit' },
    ];
};
