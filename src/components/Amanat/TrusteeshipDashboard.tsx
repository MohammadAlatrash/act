'use client';

import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useLanguage } from '../../context/LanguageContext';
import { Task, DailyBioState } from '../../types';
import './Amanat.css';

export default function TrusteeshipDashboard() {
    const { t } = useLanguage();
    const [tasks] = useLocalStorage<Task[]>('tasks', []);
    const [sleepLog] = useLocalStorage<number[]>('sleep-log', [7.5]);

    const totalLegacyWork = tasks.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (t.actualHours * (t.legacyScore / 100)), 0);
    const avgSleep = sleepLog.length > 0 ? (sleepLog.reduce((a, b) => a + b, 0) / sleepLog.length).toFixed(1) : 0;

    const trusts = [
        { name: t.amanat.time, value: `${totalLegacyWork.toFixed(1)} ${t.common.hours}`, desc: t.amanat.timeDesc, status: 'Optimal', icon: '⏳' },
        { name: t.amanat.health, value: `${avgSleep} ${t.common.hours}`, desc: t.amanat.healthDesc, status: 'Refining', icon: '🌿' },
        { name: t.amanat.mind, value: 'High', desc: t.amanat.mindDesc, status: 'Radiant', icon: '🧠' }
    ];

    return (
        <div className="amanat-dashboard glass-panel">
            <div className="amanat-header">
                <h2 className="gradient-text">{t.amanat.title}</h2>
                <p className="text-secondary">{t.amanat.subtitle}</p>
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
                    <p className="arabic-verse">{t.amanat.verse}</p>
                    <p className="verse-meaning text-muted italic">{t.amanat.verseMeaning}</p>
                </div>
            </div>
        </div>
    );
}
