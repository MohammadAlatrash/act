'use client';

import React, { useState, useEffect } from 'react';
import { Task, Priority, Status, StrategicGoal, SovereignAnchor } from '../../types';
import { calculateRemainingVelocity } from '../../lib/productivity';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useFocus } from '../../context/FocusContext';
import { predictFailureProbability } from '../../lib/intelligence';
import { DailyBioState, Mood } from '../../types';
import IntentionGateway from './IntentionGateway';
import './Tasks.css';

export default function TaskManager() {
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [
        {
            id: '1',
            title: 'Setup Production Server',
            description: 'Configure Nginx and SSL for the main domain.',
            priority: 'Urgent',
            status: 'In Progress',
            estimatedHours: 10,
            actualHours: 4.5,
            deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
            subtasks: [],
            timeEntries: [],
            deferralHistory: [],
            legacyScore: 80,
            createdAt: new Date().toISOString(),
        }
    ]);

    const [goals] = useLocalStorage<StrategicGoal[]>('strategic-goals', []);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState<Partial<Task>>({
        title: '',
        priority: 'Medium',
        estimatedHours: 1,
        deadline: new Date().toISOString().split('T')[0],
        goalId: '',
        isAtomic: false,
        legacyScore: 50,
        anchorId: undefined
    });

    const [anchors] = useLocalStorage<SovereignAnchor[]>('sovereign-anchors', [
        { id: 'fajr', name: 'Fajr Anchor (الفجر)', startTime: '05:00', durationMinutes: 30, type: 'Spiritual' },
        { id: 'dhuhr', name: 'Dhuhr Anchor (الظهر)', startTime: '12:00', durationMinutes: 30, type: 'Spiritual' },
        { id: 'asr', name: 'Asr Anchor (العصر)', startTime: '15:30', durationMinutes: 30, type: 'Spiritual' },
        { id: 'maghrib', name: 'Maghrib Anchor (المغرب)', startTime: '18:00', durationMinutes: 30, type: 'Spiritual' },
        { id: 'isha', name: 'Isha Anchor (العشاء)', startTime: '19:30', durationMinutes: 30, type: 'Spiritual' }
    ]);

    const { startFocus, stopFocus, isFocusActive, uiMode } = useFocus();
    const [deferringTaskId, setDeferringTaskId] = useState<string | null>(null);
    const [intentionTaskId, setIntentionTaskId] = useState<string | null>(null);

    const addTask = () => {
        if (!newTask.title) return;
        const task: Task = {
            id: Math.random().toString(36).substr(2, 9),
            goalId: newTask.goalId,
            title: newTask.title!,
            description: newTask.description || '',
            priority: (newTask.priority as Priority) || 'Medium',
            status: 'Pending',
            estimatedHours: Number(newTask.estimatedHours) || 1,
            actualHours: 0,
            isAtomic: newTask.isAtomic || newTask.estimatedHours! <= 0.04, // Auto-detect if < 2 mins approx
            deadline: newTask.deadline || new Date().toISOString().split('T')[0],
            subtasks: [],
            timeEntries: [],
            deferralHistory: [],
            legacyScore: newTask.legacyScore || 50,
            anchorId: newTask.anchorId,
            createdAt: new Date().toISOString(),
        };
        setTasks([...tasks, task]);
        setIsModalOpen(false);
        setNewTask({ title: '', description: '', priority: 'Medium', estimatedHours: 1, deadline: new Date().toISOString().split('T')[0], goalId: '', isAtomic: false, legacyScore: 50, anchorId: undefined });
    };

    const updateActualHours = (id: string, delta: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, actualHours: Math.max(0, t.actualHours + delta) } : t));
    };

    const toggleComplete = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
    };

    const updateTaskStatus = (id: string, newStatus: Status) => {
        if (newStatus === 'Deferred') {
            setDeferringTaskId(id);
            return;
        }
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const handleDefer = (id: string, reason: string, note: string) => {
        setTasks(tasks.map(t => t.id === id ? {
            ...t,
            status: 'Deferred',
            deferralHistory: [...t.deferralHistory, { date: new Date().toISOString(), reason: reason as any, note }]
        } : t));
    };

    const handleSplit = (task: Task) => {
        const halfTime = task.estimatedHours / 2;
        const subTaskTitle = `${task.title} (Part 1)`;
        const newPart2Title = `${task.title} (Part 2)`;

        const part1 = { ...task, title: subTaskTitle, estimatedHours: halfTime };
        const part2 = { ...task, id: Math.random().toString(36).substr(2, 9), title: newPart2Title, estimatedHours: halfTime, createdAt: new Date().toISOString() };

        setTasks(prev => prev.filter(t => t.id !== task.id).concat([part1, part2]));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const handleIntentConfirm = (intent: any) => {
        if (!intentionTaskId) return;
        const updatedTasks = tasks.map(t =>
            t.id === intentionTaskId ? { ...t, intentTag: intent } : t
        );
        setTasks(updatedTasks);
        startFocus(intentionTaskId);
        setIntentionTaskId(null);
    };

    const handleFocusTrigger = (id: string) => {
        if (isFocusActive) {
            stopFocus();
        } else {
            setIntentionTaskId(id);
        }
    };

    const [sleepLog] = useLocalStorage<number[]>('sleep-log', [7.5]);
    const [currentMood] = useLocalStorage<Mood>('current-mood', 'Steady');

    if (!mounted) return <div className="task-manager glass-panel">Syncing operations...</div>;

    const sleepDebt = Math.max(0, 8 - (sleepLog[sleepLog.length - 1] || 7.5));
    const bioState: DailyBioState = {
        date: new Date().toISOString(),
        energyGraph: [],
        avgEnergy: 70 - (sleepDebt * 5),
        sleepQuality: Math.max(0, 100 - (sleepDebt * 10)),
        mood: currentMood
    };

    return (
        <div className="task-manager glass-panel">
            <div className="task-header">
                <h2 className="gradient-text">Active Operations</h2>
                <button className="add-btn glow-border" onClick={() => setIsModalOpen(true)}>+ New Strategic Task</button>
            </div>

            <div className="task-list">
                {tasks.map(task => {
                    const risk = predictFailureProbability([task], bioState);
                    return (
                        <div key={task.id} className={`task-card glass-panel ${task.priority.toLowerCase()} ${task.status === 'Completed' ? 'completed-task' : ''}`}>
                            <div className="task-header-row">
                                <div className="task-title-group">
                                    <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                                    <h4>{task.title} {task.isAtomic && <span className="atomic-tag">⚛️ Atomic</span>}</h4>
                                    {task.goalId && <span className="goal-link-tag">Target: {goals.find(g => g.id === task.goalId)?.title}</span>}
                                    <span className="impact-tag">Impact: {task.legacyScore}%</span>
                                    {task.anchorId && (
                                        <span className="prayer-anchor-tag">
                                            ⚓ {anchors.find(a => a.id === task.anchorId)?.name.split(' (')[0] || 'Anchor'}
                                        </span>
                                    )}
                                </div>
                                <div className="task-actions">
                                    <button onClick={() => updateTaskStatus(task.id, task.status === 'Completed' ? 'Pending' : 'Completed')}>
                                        {task.status === 'Completed' ? '↺' : '✓'}
                                    </button>
                                    <button
                                        className={`focus-trigger ${isFocusActive ? 'active' : ''}`}
                                        onClick={() => handleFocusTrigger(task.id)}
                                        title="Engage Focus Sentinel"
                                    >
                                        🎯
                                    </button>
                                    <button onClick={() => updateTaskStatus(task.id, 'Deferred')}>↷</button>
                                    <button onClick={() => deleteTask(task.id)} className="delete-btn">×</button>
                                </div>
                            </div>

                            <p className="task-desc">{task.description}</p>

                            {risk > 0.7 && task.status !== 'Completed' && (
                                <div className="proactive-mitigation glow-border">
                                    <span className="icon">⚠️</span>
                                    <div className="mitigation-content">
                                        <strong>Failure Risk: {Math.round(risk * 100)}%</strong>
                                        <p>Probability high for today. Consider splitting this mission.</p>
                                        <button className="split-btn" onClick={() => handleSplit(task)}>Split Mission</button>
                                    </div>
                                </div>
                            )}

                            <div className="task-metrics">
                                <div className="metric">
                                    <span className="label">Remaining Velocity</span>
                                    <span className="value">{calculateRemainingVelocity(task)} hrs/day</span>
                                </div>
                            </div>

                            <div className="task-footer">
                                <div className="task-hours">
                                    <button onClick={() => updateActualHours(task.id, -0.5)}>-</button>
                                    <span>{task.actualHours} / {task.estimatedHours} hrs</span>
                                    <button onClick={() => updateActualHours(task.id, 0.5)}>+</button>
                                    <div className="progress-bar-container">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${Math.min(100, (task.actualHours / task.estimatedHours) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="task-meta">
                                    <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel glow-border">
                        <h3>Add New Task</h3>
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={newTask.title}
                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            value={newTask.description}
                            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                        ></textarea>
                        <div className="modal-row">
                            <select
                                value={newTask.priority}
                                onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                            >
                                <option value="Urgent">Urgent</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Est. Hours"
                                value={newTask.estimatedHours}
                                onChange={e => setNewTask({ ...newTask, estimatedHours: Number(e.target.value) })}
                            />
                        </div>
                        <div className="modal-row checkbox-row">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={newTask.isAtomic}
                                    onChange={e => setNewTask({ ...newTask, isAtomic: e.target.checked })}
                                />
                                Atomic Habit (Two-Minute Rule)
                            </label>
                        </div>
                        <input
                            type="date"
                            value={newTask.deadline}
                            onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                        />
                        <div className="modal-row anchor-row">
                            <select
                                value={newTask.anchorId || ''}
                                onChange={e => setNewTask({ ...newTask, anchorId: e.target.value })}
                            >
                                <option value="">No Sovereign Anchor (Variable Path)</option>
                                {anchors.map(anchor => (
                                    <option key={anchor.id} value={anchor.id}>
                                        {anchor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <select
                            className="goal-picker"
                            value={newTask.goalId}
                            onChange={e => setNewTask({ ...newTask, goalId: e.target.value })}
                        >
                            <option value="">Link to Strategic Vision (Optional)</option>
                            {goals.map(g => (
                                <option key={g.id} value={g.id}>{g.title}</option>
                            ))}
                        </select>
                        <div className="modal-row legacy-row">
                            <label>Legacy Impact (الأثر المتوقع): {newTask.legacyScore}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={newTask.legacyScore}
                                onChange={e => setNewTask({ ...newTask, legacyScore: Number(e.target.value) })}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="confirm-btn" onClick={addTask}>Establish Task</button>
                        </div>
                    </div>
                </div>
            )}

            <DeferralModal
                isOpen={!!deferringTaskId}
                onConfirm={(reason, note) => {
                    handleDefer(deferringTaskId!, reason, note);
                    setDeferringTaskId(null);
                }}
                onCancel={() => setDeferringTaskId(null)}
            />
        </div>
    );
}

function DeferralModal({ isOpen, onConfirm, onCancel }: { isOpen: boolean, onConfirm: (reason: string, note: string) => void, onCancel: () => void }) {
    const [reason, setReason] = useState('Distraction');
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel glow-border">
                <h3 className="text-error">Interrogative Rollover (لماذا تعثرت؟)</h3>
                <p className="text-secondary">No deferral without awareness. Why was this mission delayed?</p>
                <select value={reason} onChange={e => setReason(e.target.value)}>
                    <option value="Distraction">Distraction (تشتت)</option>
                    <option value="Emergency">Emergency (طوارئ)</option>
                    <option value="Energy Crash">Energy Crash (خمول)</option>
                    <option value="Over-estimated">Over-estimated (سوء تقدير)</option>
                    <option value="Higher Priority">Higher Priority (أولوية أخرى)</option>
                </select>
                <textarea
                    placeholder="Brief explanation..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                ></textarea>
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onCancel}>Abort</button>
                    <button className="confirm-btn" onClick={() => onConfirm(reason, note)}>Log & Defer</button>
                </div>
            </div>
        </div>
    );
}
