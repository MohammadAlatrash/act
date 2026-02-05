'use client';

import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Idea } from '../../types';
import './QuickCapture.css';

export default function QuickCapture() {
    const [isOpen, setIsOpen] = useState(false);
    const [ideas, setIdeas] = useLocalStorage<Idea[]>('ideas', []);
    const [newIdea, setNewIdea] = useState({ title: '', description: '' });

    const captureIdea = () => {
        if (!newIdea.title) return;
        const idea: Idea = {
            id: Math.random().toString(36).substr(2, 9),
            title: newIdea.title,
            description: newIdea.description,
            createdAt: new Date().toISOString(),
            legacyPotential: 50,
            status: 'Captures'
        };
        setIdeas([...ideas, idea]);
        setNewIdea({ title: '', description: '' });
        setIsOpen(false);
    };

    return (
        <div className={`quick-capture-container ${isOpen ? 'open' : ''}`}>
            <button
                className="capture-fab glow-border"
                onClick={() => setIsOpen(!isOpen)}
                title="Capture Strategic Flash"
            >
                {isOpen ? '×' : '⚡'}
            </button>

            {isOpen && (
                <div className="capture-overlay glass-panel animate-slide-up">
                    <h3>Capture Flash (خزنة الأفكار)</h3>
                    <p className="text-secondary text-sm">Clear your mind. Offload the idea now, refine it later.</p>
                    <input
                        type="text"
                        placeholder="Idea Headline..."
                        value={newIdea.title}
                        onChange={e => setNewIdea({ ...newIdea, title: e.target.value })}
                        autoFocus
                    />
                    <textarea
                        placeholder="Brief context (optional)..."
                        value={newIdea.description}
                        onChange={e => setNewIdea({ ...newIdea, description: e.target.value })}
                    />
                    <div className="capture-actions">
                        <button className="confirm-btn" onClick={captureIdea}>Deposit into Vault</button>
                    </div>
                </div>
            )}
        </div>
    );
}
