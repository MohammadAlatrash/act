'use client';

import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Task, TimeEntry } from '../../types';
import { useFocus } from '../../context/FocusContext';
import './Audit.css';

export default function InterrogativeLoop() {
    const { isFocusActive } = useFocus();
    const [tasks] = useLocalStorage<Task[]>('tasks', []);
    const [auditHistory, setAuditHistory] = useLocalStorage<any[]>('audit-history', []);
    const [step, setStep] = useState(0);
    const [isInterrogating, setIsInterrogating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<'Unknown' | 'Aligned' | 'Neutral' | 'Misaligned'>('Unknown');
    const [currentNote, setCurrentNote] = useState('');
    const [currentAudit, setCurrentAudit] = useState({
        blocker: '',
        feeling: 'Steady',
        energyLeak: '',
        lesson: '',
        barakahScore: 50,
        spiritualPresence: 'Aligned'
    });

    const pendingTasks = tasks.filter(t => t.status !== 'Completed');
    const completedTasks = tasks.filter(t => t.status === 'Completed');

    const handleCompleteAudit = () => {
        setAuditHistory([...auditHistory, { ...currentAudit, date: new Date().toISOString(), type: 'Reflection' }]);
        setStep(3); // Completion State
    };

    const triggerAudit = () => {
        setIsInterrogating(true);
        setSelectedCategory('Unknown');
    };

    const submitAudit = () => {
        setAuditHistory([...auditHistory, {
            date: new Date().toISOString(),
            type: 'Investigation',
            category: selectedCategory,
            duration: '45min'
        }]);
        setIsInterrogating(false);
    };

    // Focus Sentinel Logic removed from here for global implementation.

    if (step === 3) {
        return (
            <div className="audit-container glass-panel text-center">
                <h2 className="gradient-text">Awareness Locked</h2>
                <p>Your reflection has been integrated into the Sovereign database.</p>
                <button className="primary-btn mt-6" onClick={() => setStep(0)}>New Audit</button>
            </div>
        );
    }

    return (
        <div className="audit-container glass-panel">
            <header className="audit-header">
                <h2 className="gradient-text">Existential Audit | محقق الأثر</h2>
                <button className="trigger-btn glow-border" onClick={triggerAudit}>
                    Detect Legacy Gap
                </button>
            </header>

            <div className="audit-progress-bar">
                <div className={`step-dot ${step >= 0 ? 'active' : ''}`}></div>
                <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
                <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
            </div>

            <div className="audit-content">
                {step === 0 && (
                    <div className="audit-step animate-fade-in">
                        <h3>1. The Reality Check</h3>
                        <p>You have {pendingTasks.length} pending missions and {completedTasks.length} successful deployments today.</p>
                        <label>What was the primary friction point today?</label>
                        <textarea
                            placeholder="e.g., Slack interruptions, Low energy after lunch..."
                            value={currentAudit.blocker}
                            onChange={e => setCurrentAudit({ ...currentAudit, blocker: e.target.value })}
                        />
                        <button className="next-btn" onClick={() => setStep(1)}>Next Frequency</button>
                    </div>
                )}

                {step === 1 && (
                    <div className="audit-step animate-fade-in">
                        <h3>2. Conscious State</h3>
                        <label>How would you describe your cognitive state today?</label>
                        <div className="state-picker">
                            {['Radiant', 'Steady', 'Foggy', 'Burnout'].map(s => (
                                <button
                                    key={s}
                                    className={`state-btn ${currentAudit.feeling === s ? 'active' : ''}`}
                                    onClick={() => setCurrentAudit({ ...currentAudit, feeling: s })}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <label>Identify one "Leak" (أين ضاع الوقت؟)</label>
                        <input
                            type="text"
                            placeholder="e.g., Infinite Scrolling, Over-thinking..."
                            value={currentAudit.energyLeak}
                            onChange={e => setCurrentAudit({ ...currentAudit, energyLeak: e.target.value })}
                        />
                        <div className="btn-group">
                            <button className="secondary-btn" onClick={() => setStep(0)}>Back</button>
                            <button className="next-btn" onClick={() => setStep(2)}>Final Insight</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="audit-step animate-fade-in">
                        <h3>3. Sovereign Wisdom</h3>
                        <label>What is the one tactical adjustment for tomorrow?</label>
                        <textarea
                            placeholder="e.g., Phone in another room until 11 AM..."
                            value={currentAudit.lesson}
                            onChange={e => setCurrentAudit({ ...currentAudit, lesson: e.target.value })}
                        />
                        <div className="modal-row legacy-row mt-4">
                            <label>Presence & Barakah (مستوى الحضور والبركة): {currentAudit.barakahScore}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={currentAudit.barakahScore}
                                onChange={e => setCurrentAudit({ ...currentAudit, barakahScore: Number(e.target.value) })}
                            />
                        </div>
                        <div className="btn-group mt-6">
                            <button className="secondary-btn" onClick={() => setStep(1)}>Back</button>
                            <button className="confirm-btn" onClick={handleCompleteAudit}>Lock Session</button>
                        </div>
                    </div>
                )}
            </div>

            {isInterrogating && (
                <div className="interrogation-modal glass-panel glow-border animate-slide-up">
                    <div className="interrogation-content">
                        <h3>🕊️ Gentle Muhasabah | وقفة محاسبة</h3>
                        <p>I noticed a quiet period in your legacy journey (14:15 - 15:00).</p>
                        <p className="question text-accent">"هل هذا النشاط يخدم (الأثر) الذي تود تركه؟"</p>

                        <div className="category-selection">
                            {(['Aligned', 'Neutral', 'Misaligned'] as const).map(cat => (
                                <button
                                    key={cat}
                                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat === 'Aligned' ? 'Aligned (على الدرب)' : cat === 'Neutral' ? 'Neutral (عادي)' : 'Deviation (انحراف)'}
                                </button>
                            ))}
                        </div>

                        <textarea
                            placeholder="How can we reclaim this intention tomorrow? (e.g. Seeking rest, distraction, emergency...)"
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            className="audit-textarea"
                        />

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setIsInterrogating(false)}>Keep as is</button>
                            <button
                                className="confirm-btn"
                                onClick={submitAudit}
                                disabled={selectedCategory === 'Unknown'}
                            >
                                Re-align Intention
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="audit-history mt-10">
                <h3 className="gradient-text">Legacy Reclaimed | الأثر المستعاد</h3>
                <div className="entry-list mt-4">
                    {auditHistory.length === 0 ? (
                        <p className="text-muted italic">No legacy records yet.</p>
                    ) : (
                        auditHistory.slice().reverse().map((entry, i) => (
                            <div key={i} className="history-entry glass-panel mb-2">
                                <span className="entry-date">{new Date(entry.date).toLocaleTimeString()}</span>
                                <span className="entry-type">{entry.type}</span>
                                <p className="entry-desc">{entry.lesson || entry.category || entry.blocker}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
