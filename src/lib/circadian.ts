/**
 * Circadian & Performance Intelligence Logic
 * Based on models used in apps like Rise Science.
 */

export interface CircadianData {
    time: string; // HH:mm
    level: number; // 0 to 100
    label: 'Peak' | 'Dip' | 'Rebound' | 'Wind Down';
}

export function calculateCircadianRhythm(sleepDebt: number, wakeTime: string = '07:00'): CircadianData[] {
    const wakeHour = parseInt(wakeTime.split(':')[0]);
    const rhythm: CircadianData[] = [];

    for (let hour = 0; hour < 24; hour++) {
        const currentHour = (hour + wakeHour) % 24;
        const timeString = `${currentHour.toString().padStart(2, '0')}:00`;

        let level = 50;
        let label: CircadianData['label'] = 'Peak';

        // Morning Peak (approx 2-4 hours after waking)
        if (hour >= 2 && hour <= 5) {
            level = 85 - (sleepDebt * 5);
            label = 'Peak';
        }
        // Afternoon Dip (approx 7-9 hours after waking)
        else if (hour >= 7 && hour <= 9) {
            level = 40 - (sleepDebt * 10);
            label = 'Dip';
        }
        // Evening Rebound (approx 10-12 hours after waking)
        else if (hour >= 10 && hour <= 13) {
            level = 75 - (sleepDebt * 5);
            label = 'Rebound';
        }
        // Wind Down
        else if (hour >= 14) {
            level = 30;
            label = 'Wind Down';
        } else {
            level = 60;
            label = 'Peak';
        }

        rhythm.push({ time: timeString, level: Math.max(0, level), label });
    }

    return rhythm;
}

export function getOptimalFocusWindow(rhythm: CircadianData[]): CircadianData | null {
    return rhythm.reduce((prev, current) => (prev.level > current.level) ? prev : current);
}
