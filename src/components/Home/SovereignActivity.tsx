'use client';

import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Task, TimeEntry } from '../../types';
import './SovereignActivity.css';

interface Idea {
    id: string;
    content: string;
    timestamp: string;
}

export default function SovereignActivity() {
    const [auditHistory] = useLocalStorage<any[]>('audit-history', []);
    const [ideas] = useLocalStorage<Idea[]>('ideas', []);
    const [tasks] = useLocalStorage<Task[]>('tasks', []);

    const recentAudits = auditHistory.slice(-5).reverse();
    const recentIdeas = ideas.slice(-5).reverse();
    const recentTasks = tasks.filter(t => t.status === 'Completed').slice(-5).reverse();

    return (
        <div className="sovereign-activity glass-panel">
            <div className="activity-header">
                <h2 className="gradient-text">Activity & Evolution | الأنشطة والتحديثات</h2>
                <p className="text-secondary">A unified terminal for all movements in your legacy.</p>
            </div>

            <div className="activity-sections">
                <section className="activity-card glass-panel">
                    <h3>💡 Idea Inbox (مستودع الأفكار)</h3>
                    <div className="activity-list">
                        {recentIdeas.length > 0 ? recentIdeas.map(idea => (
                            <div key={idea.id} className="activity-item idea">
                                <span className="time">{new Date(idea.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <p>{idea.content}</p>
                            </div>
                        )) : <p className="empty">No ideas captured yet.</p>}
                    </div>
                </section>

                <section className="activity-card glass-panel">
                    <h3>✅ Completed Missions (الإنجازات)</h3>
                    <div className="activity-list">
                        {recentTasks.length > 0 ? recentTasks.map(task => (
                            <div key={task.id} className="activity-item task">
                                <span className="time">Done</span>
                                <p>{task.title}</p>
                                <span className="impact">+{task.legacyScore} Athar</span>
                            </div>
                        )) : <p className="empty">No missions completed today.</p>}
                    </div>
                </section>

                <section className="activity-card glass-panel">
                    <h3>🔍 Legacy Audits (المراجعات)</h3>
                    <div className="activity-list">
                        {recentAudits.length > 0 ? recentAudits.map((audit, idx) => (
                            <div key={idx} className="activity-item audit">
                                <span className="time">{audit.timestamp ? new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</span>
                                <p>Reflected on: {audit.category || 'Gap'}</p>
                                <span className={`status ${audit.category?.toLowerCase()}`}>{audit.category}</span>
                            </div>
                        )) : <p className="empty">No audits recorded yet.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
}
