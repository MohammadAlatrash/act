'use client';

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { calculateCircadianRhythm, getOptimalFocusWindow } from '../../lib/circadian';

export default function EnergyMonitorWidget() {
    const [sleepLog] = useLocalStorage<number[]>('sleep-log', [7.5]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const sleepDebt = Math.max(0, 8 - (sleepLog[sleepLog.length - 1] || 7.5));
    const rhythm = calculateCircadianRhythm(sleepDebt);
    const focusWindow = getOptimalFocusWindow(rhythm);

    // Find current hour's rhythm
    const currentHour = new Date().getHours();
    const currentRhythm = rhythm.find(r => parseInt(r.time.split(':')[0]) === currentHour) || rhythm[0];

    if (!mounted) return null;

    return (
        <div className="energy-widget glass-panel glow-border">
            <div className="widget-header">
                <h4>Engine Status | أداء الأثر</h4>
                <span className={`status-pill ${currentRhythm.label.toLowerCase()}`}>
                    {currentRhythm.label}
                </span>
            </div>

            <div className="battery-display">
                <div className="battery-level" style={{ width: `${currentRhythm.level}%` }}></div>
                <span className="battery-percentage">{currentRhythm.level}%</span>
            </div>

            <div className="widget-insight mt-3">
                <p className="text-secondary">
                    {currentRhythm.level > 70
                        ? "Peak performance detected. Execute high-intensity strategic tasks now."
                        : "Biological dip active. Shift to administrative work or active recovery."}
                </p>
                <div className="next-peak text-accent mt-2">
                    Next Peak: <strong>{focusWindow?.time}</strong>
                </div>
            </div>
        </div>
    );
}
