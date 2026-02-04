'use client';

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { calculateCircadianRhythm, getOptimalFocusWindow } from '../../lib/circadian';
import './Biology.css';

export default function BiologicalMonitor() {
    const [sleepLog, setSleepLog] = useLocalStorage<number[]>('sleep-log', [7.2, 7.5, 6.8, 8.1, 7.4]);
    const [sleepInput, setSleepInput] = useState('');

    const [habits, setHabits] = useLocalStorage<any[]>('habits', [
        { name: 'Morning Deep Work', streak: 5, history: [true, true, true, true, true, false, false] },
        { name: 'Reading (30 mins)', streak: 12, history: [true, true, true, true, true, true, true] }
    ]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleHabit = (index: number) => {
        const newHabits = [...habits];
        const todayIndex = 6; // Mocking today as last day in array
        newHabits[index].history[todayIndex] = !newHabits[index].history[todayIndex];
        newHabits[index].streak = newHabits[index].history[todayIndex] ? newHabits[index].streak + 1 : Math.max(0, newHabits[index].streak - 1);
        setHabits(newHabits);
    };

    const addSleep = () => {
        if (!sleepInput) return;
        setSleepLog([...sleepLog, Number(sleepInput)]);
        setSleepInput('');
    };

    const rhythm = calculateCircadianRhythm(Math.max(0, 8 - (sleepLog[sleepLog.length - 1] || 7.5)));
    const focusWindow = getOptimalFocusWindow(rhythm);
    const avgSleep = (sleepLog.reduce((a, b) => a + b, 0) / sleepLog.length).toFixed(1);

    return (
        <div className="bio-monitor glass-panel">
            <div className="bio-header">
                <h2 className="gradient-text">Biological Engine</h2>
                <p className="text-secondary">Sync your body with your strategy. Avg Sleep: {avgSleep} hrs</p>
            </div>

            <div className="bio-grid">
                <section className="circadian-prediction glass-panel glow-border">
                    <h3>Energy Forecast</h3>
                    <p className="text-muted">Predictions based on sleep debt.</p>
                    {mounted ? (
                        <>
                            <div className="focus-window-alert">
                                <span className="icon">⚡</span>
                                <div>
                                    <strong>Peak Focus Window:</strong>
                                    <span> {focusWindow?.time} - {focusWindow?.label} ({focusWindow?.level}%)</span>
                                </div>
                            </div>
                            <div className="rhythm-chart">
                                {rhythm.filter((_, i) => i % 3 === 0).map((r, i) => (
                                    <div key={i} className="rhythm-bar-group">
                                        <div className={`rhythm-bar ${r.label.toLowerCase()}`} style={{ height: `${r.level}%` }}></div>
                                        <span>{r.time}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-secondary">Syncing rhythms...</p>
                    )}
                </section>

                <section className="sleep-tracker glass-panel">
                    <h3>Sleep Tracking</h3>
                    <div className="sleep-input-group">
                        <div className="input-field">
                            <label>Last Night's Sleep</label>
                            <input
                                type="number"
                                placeholder="Hours"
                                step="0.1"
                                value={sleepInput}
                                onChange={e => setSleepInput(e.target.value)}
                            />
                        </div>
                        <div className="sleep-stages">
                            <div className="stage rem"><span>REM</span> 20%</div>
                            <div className="stage deep"><span>Deep</span> 35%</div>
                            <div className="stage light"><span>Light</span> 45%</div>
                        </div>
                    </div>
                    <button className="save-btn" onClick={addSleep}>Log Cycle</button>
                </section>

                <section className="habit-tracking glass-panel">
                    <h3>Daily Routines</h3>
                    <div className="habit-list">
                        {habits.map((habit, idx) => (
                            <div key={idx} className="habit-item">
                                <div className="habit-info">
                                    <span>{habit.name}</span>
                                    <span>Streak: {habit.streak}🔥</span>
                                </div>
                                <div className="habit-check-group">
                                    {habit.history.map((active: boolean, d: number) => (
                                        <div
                                            key={d}
                                            className={`day-circle ${active ? 'active' : ''}`}
                                            onClick={() => d === 6 && toggleHabit(idx)}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
