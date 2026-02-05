'use client';

import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Task, DailyBioState } from '../../types';
import './Amanat.css';

export default function TrusteeshipDashboard() {
    const [tasks] = useLocalStorage<Task[]>('tasks', []);
    const [sleepLog] = useLocalStorage<number[]>('sleep-log', [7.5]);

    const totalLegacyWork = tasks.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (t.actualHours * (t.legacyScore / 100)), 0);
    const avgSleep = sleepLog.length > 0 ? (sleepLog.reduce((a, b) => a + b, 0) / sleepLog.length).toFixed(1) : 0;

    const trusts = [
        { name: 'أمانة الوقت (Time)', value: `${totalLegacyWork.toFixed(1)} hrs`, desc: 'Invested in Legacy', status: 'Optimal', icon: '⏳' },
        { name: 'أمانة الصحة (Health)', value: `${avgSleep} hrs`, desc: 'Average Restoration', status: 'Refining', icon: '🌿' },
        { name: 'أمانة العقل (Cognition)', value: 'High', desc: 'Focus Alignment', status: 'Radiant', icon: '🧠' }
    ];

    return (
        <div className="amanat-dashboard glass-panel">
            <div className="amanat-header">
                <h2 className="gradient-text">Trusteeship Dashboard | لوحة الأمانات</h2>
                <p className="text-secondary">"You are a steward (مستخلف) of these gifts. How is your companionship with them?"</p>
            </div>

            <div className="amanat-grid">
                {trusts.map(trust => (
                    <div key={trust.name} className="trust-card glass-panel glow-border">
                        <div className="trust-icon">{trust.icon}</div>
                        <div className="trust-info">
                            <h3>{trust.name}</h3>
                            <div className="trust-value">{trust.value}</div>
                            <p className="trust-desc">{trust.desc}</p>
                            <span className={`trust-status ${trust.status.toLowerCase()}`}>{trust.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="amanat-footer mt-8">
                <div className="verse-panel glass-panel">
                    <p className="arabic-verse">"أفحسبتم أنما خلقناكم عبثاً"</p>
                    <p className="verse-meaning text-muted italic">"Did you then think that We created you in vain?"</p>
                </div>
            </div>
        </div>
    );
}
