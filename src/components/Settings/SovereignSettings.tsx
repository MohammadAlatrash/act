'use client';

import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SovereignAnchor } from '../../types';
import './SovereignSettings.css';

export default function SovereignSettings() {
    const defaultAnchors: SovereignAnchor[] = [
        { id: 'fajr', name: 'Fajr Prayer (صلاة الفجر)', startTime: '05:00', durationMinutes: 30, type: 'Spiritual', icon: '🕋' },
        { id: 'dhuhr', name: 'Dhuhr Prayer (صلاة الظهر)', startTime: '12:00', durationMinutes: 30, type: 'Spiritual', icon: '🕋' },
        { id: 'asr', name: 'Asr Prayer (صلاة العصر)', startTime: '15:30', durationMinutes: 30, type: 'Spiritual', icon: '🕋' },
        { id: 'maghrib', name: 'Maghrib Prayer (صلاة المغرب)', startTime: '18:00', durationMinutes: 30, type: 'Spiritual', icon: '🕋' },
        { id: 'isha', name: 'Isha Prayer (صلاة العشاء)', startTime: '19:30', durationMinutes: 30, type: 'Spiritual', icon: '🕋' }
    ];

    const [anchors, setAnchors] = useLocalStorage<SovereignAnchor[]>('sovereign-anchors', defaultAnchors);
    const [isAdding, setIsAdding] = useState(false);
    const [newAnchor, setNewAnchor] = useState<Partial<SovereignAnchor>>({
        type: 'Other',
        durationMinutes: 30
    });

    const addAnchor = () => {
        if (!newAnchor.name || !newAnchor.startTime) return;
        const anchor: SovereignAnchor = {
            id: Math.random().toString(36).substr(2, 9),
            name: newAnchor.name,
            startTime: newAnchor.startTime,
            durationMinutes: newAnchor.durationMinutes || 30,
            type: newAnchor.type as any,
            icon: '⚓'
        };
        setAnchors([...anchors, anchor]);
        setIsAdding(false);
        setNewAnchor({ type: 'Other', durationMinutes: 30 });
    };

    const deleteAnchor = (id: string) => {
        setAnchors(anchors.filter(a => a.id !== id));
    };

    return (
        <div className="settings-container glass-panel">
            <h2 className="gradient-text">Sovereign Constants | ثوابت السيادة</h2>
            <p className="text-secondary mb-6">Define the non-negotiable anchors of your day. These constants serve as the backbone of your time budget.</p>

            <div className="anchors-grid">
                {anchors.map(anchor => (
                    <div key={anchor.id} className="anchor-card glass-panel glow-border">
                        <div className="anchor-icon">{anchor.icon || '⚓'}</div>
                        <div className="anchor-info">
                            <h4>{anchor.name}</h4>
                            <span>{anchor.startTime} ({anchor.durationMinutes} min)</span>
                        </div>
                        <button className="delete-btn" onClick={() => deleteAnchor(anchor.id)}>×</button>
                    </div>
                ))}
            </div>

            <button className="primary-btn mt-6" onClick={() => setIsAdding(true)}>+ Add New Constant</button>

            {isAdding && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel animate-slide-up">
                        <h3>New Daily Constant</h3>
                        <input
                            type="text"
                            placeholder="Constant Name (e.g., Team Sync, Gym)"
                            value={newAnchor.name || ''}
                            onChange={e => setNewAnchor({ ...newAnchor, name: e.target.value })}
                        />
                        <div className="modal-row">
                            <input
                                type="time"
                                value={newAnchor.startTime || ''}
                                onChange={e => setNewAnchor({ ...newAnchor, startTime: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Duration (min)"
                                value={newAnchor.durationMinutes}
                                onChange={e => setNewAnchor({ ...newAnchor, durationMinutes: Number(e.target.value) })}
                            />
                        </div>
                        <select
                            value={newAnchor.type}
                            onChange={e => setNewAnchor({ ...newAnchor, type: e.target.value as any })}
                        >
                            <option value="Spiritual">Spiritual</option>
                            <option value="Biological">Biological</option>
                            <option value="Social">Social</option>
                            <option value="Other">Other</option>
                        </select>
                        <div className="modal-actions">
                            <button className="secondary-btn" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button className="confirm-btn" onClick={addAnchor}>Establish Anchor</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
