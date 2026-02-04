'use client';

import React, { useState, useEffect } from 'react';
import { Task, Priority, StrategicGoal } from '../../types';
import { calculateRemainingVelocity } from '../../lib/productivity';
import { useLocalStorage } from '../../hooks/useLocalStorage';
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
        description: '',
        priority: 'Medium',
        estimatedHours: 1,
        deadline: new Date().toISOString().split('T')[0],
        goalId: ''
    });

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
            deadline: new Date(newTask.deadline!).toISOString(),
            subtasks: [],
            createdAt: new Date().toISOString(),
        };
        setTasks([...tasks, task]);
        setIsModalOpen(false);
        setNewTask({ title: '', description: '', priority: 'Medium', estimatedHours: 1, deadline: new Date().toISOString().split('T')[0], goalId: '' });
    };

    const updateActualHours = (id: string, delta: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, actualHours: Math.max(0, t.actualHours + delta) } : t));
    };

    const toggleComplete = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
    };

    return (
        <div className="task-manager glass-panel">
            <div className="task-header">
                <h2 className="gradient-text">Active Operations</h2>
                <button className="add-btn glow-border" onClick={() => setIsModalOpen(true)}>+ New Strategic Task</button>
            </div>

            <div className="task-list">
                {mounted ? tasks.map(task => (
                    <div key={task.id} className={`task-card ${task.priority.toLowerCase()} ${task.status === 'Completed' ? 'completed-task' : ''}`}>
                        <div className="task-main-info">
                            <div className="task-title-row">
                                <h3>{task.title}</h3>
                                {task.goalId && <span className="goal-link-tag">Target: {goals.find(g => g.id === task.goalId)?.title}</span>}
                                <span className={`priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
                            </div>
                            <p className="task-desc">{task.description}</p>

                            <div className="task-metrics">
                                <div className="metric">
                                    <span className="label">Remaining Velocity</span>
                                    <span className="value">{calculateRemainingVelocity(task)} hrs/day</span>
                                </div>
                                <div className="metric">
                                    <span className="label">Deadline</span>
                                    <span className="value">{new Date(task.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="task-progress-section">
                            <div className="progress-text">
                                <span>{task.actualHours} / {task.estimatedHours} hrs</span>
                                <span>{Math.round((task.actualHours / task.estimatedHours) * 100)}%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${Math.min(100, (task.actualHours / task.estimatedHours) * 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="task-actions">
                            <div className="time-controls">
                                <button onClick={() => updateActualHours(task.id, -0.5)}>-0.5</button>
                                <button onClick={() => updateActualHours(task.id, 0.5)}>+0.5</button>
                            </div>
                            <button
                                className={`action-btn ${task.status === 'Completed' ? 'undo' : 'complete'}`}
                                onClick={() => toggleComplete(task.id)}
                            >
                                {task.status === 'Completed' ? 'Reopen' : 'Complete'}
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="no-tasks">Syncing operations...</p>
                )}
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
                        <input
                            type="date"
                            value={newTask.deadline}
                            onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                        />
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
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="confirm-btn" onClick={addTask}>Establish Task</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
