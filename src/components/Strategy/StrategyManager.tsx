'use client';

import React, { useState, useEffect } from 'react';
import { StrategicGoal, Task } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './Strategy.css';

export default function StrategyManager() {
    const [goals, setGoals] = useLocalStorage<StrategicGoal[]>('strategic-goals', [
        {
            id: 'g1',
            title: 'Global Market Expansion',
            type: 'Yearly',
            targetDate: '2026-12-31',
            progress: 35,
            projects: ['Launch in Europe', 'Partner with localized distributors'],
            status: 'Active'
        }
    ]);

    const [tasks] = useLocalStorage<Task[]>('tasks', []);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGoal, setNewGoal] = useState<Partial<StrategicGoal>>({
        title: '',
        type: 'Quarterly',
        targetDate: new Date().toISOString().split('T')[0],
        progress: 0,
        projects: [],
        status: 'Active'
    });

    const [projectInput, setProjectInput] = useState('');

    const addGoal = () => {
        if (!newGoal.title) return;
        const goal: StrategicGoal = {
            id: Math.random().toString(36).substr(2, 9),
            title: newGoal.title!,
            type: newGoal.type as any,
            targetDate: new Date(newGoal.targetDate!).toISOString(),
            progress: Number(newGoal.progress) || 0,
            projects: newGoal.projects || [],
            status: 'Active'
        };
        setGoals([...goals, goal]);
        setIsModalOpen(false);
        setNewGoal({ title: '', type: 'Quarterly', targetDate: new Date().toISOString().split('T')[0], progress: 0, projects: [], status: 'Active' });
    };

    const deleteGoal = (id: string) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    return (
        <div className="strategy-manager glass-panel">
            <div className="strategy-header">
                <h2 className="gradient-text">Strategic Roadmap</h2>
                <button className="add-btn glow-border" onClick={() => setIsModalOpen(true)}>+ Define Vision</button>
            </div>

            <div className="goals-grid">
                {goals.map(goal => (
                    <div key={goal.id} className="goal-card glass-panel">
                        <div className="goal-type-badge">{goal.type}</div>
                        <button className="delete-btn" onClick={() => deleteGoal(goal.id)}>×</button>
                        <h3>{goal.title}</h3>
                        <div className="goal-date">Deadline: {new Date(goal.targetDate).toLocaleDateString()}</div>

                        <div className="goal-progress">
                            <div className="progress-info">
                                <span>Completion</span>
                                <span>{goal.progress}%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-fill" style={{ width: `${goal.progress}%` }}></div>
                            </div>
                        </div>

                        <div className="goal-projects">
                            <h4>Linked Operations</h4>
                            <div className="linked-tasks-list">
                                {mounted && tasks.filter(t => t.goalId === goal.id).map(task => (
                                    <div key={task.id} className="linked-task-item">
                                        <span className={`status-dot ${task.status.toLowerCase().replace(' ', '-')}`}></span>
                                        <span className="task-name">{task.title}</span>
                                    </div>
                                ))}
                                {mounted && tasks.filter(t => t.goalId === goal.id).length === 0 && (
                                    <p className="no-tasks">No operations linked yet.</p>
                                )}
                                {!mounted && <p className="no-tasks">Syncing strategy...</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel glow-border">
                        <h3>Establish Vision</h3>
                        <input
                            type="text"
                            placeholder="Goal Title"
                            value={newGoal.title}
                            onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                        />
                        <div className="modal-row">
                            <select
                                value={newGoal.type}
                                onChange={e => setNewGoal({ ...newGoal, type: e.target.value as any })}
                            >
                                <option value="Yearly">Yearly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                            <input
                                type="date"
                                value={newGoal.targetDate}
                                onChange={e => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                            />
                        </div>

                        <div className="project-input-row">
                            <input
                                type="text"
                                placeholder="Associated Project"
                                value={projectInput}
                                onChange={e => setProjectInput(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    if (projectInput) {
                                        setNewGoal({ ...newGoal, projects: [...(newGoal.projects || []), projectInput] });
                                        setProjectInput('');
                                    }
                                }}
                            >+</button>
                        </div>
                        <div className="added-projects">
                            {newGoal.projects?.map((p, i) => <span key={i} className="project-tag">{p}</span>)}
                        </div>

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="confirm-btn" onClick={addGoal}>Lock Vision</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
