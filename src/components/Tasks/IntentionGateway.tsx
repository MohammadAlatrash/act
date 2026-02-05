'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './IntentionGateway.css';

interface IntentionGatewayProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (intent: 'Ihsan' | 'Nafa' | 'Rizq' | 'Itqan') => void;
    taskTitle: string;
}

export default function IntentionGateway({ isOpen, onClose, onConfirm, taskTitle }: IntentionGatewayProps) {
    const { t } = useLanguage();

    if (!isOpen) return null;

    const intentions = [
        { id: 'Ihsan', label: t.intention.ihsan, desc: t.intention.ihsanDesc, icon: '🌍' },
        { id: 'Nafa', label: t.intention.nafa, desc: t.intention.nafaDesc, icon: '🤝' },
        { id: 'Rizq', label: t.intention.rizq, desc: t.intention.rizqDesc, icon: '⚖️' },
        { id: 'Itqan', label: t.intention.itqan, desc: t.intention.itqanDesc, icon: '💎' }
    ];

    return (
        <div className="intention-overlay">
            <div className="intention-modal glass-panel glow-border animate-scale-up">
                <div className="modal-header">
                    <h2 className="gradient-text">{t.intention.title}</h2>
                    <p className="text-secondary">{t.intention.subtitle}: <strong>{taskTitle}</strong></p>
                </div>

                <p className="verse-quote italic">{t.intention.verse}</p>

                <div className="intention-grid">
                    {intentions.map(intent => (
                        <button
                            key={intent.id}
                            className="intention-card glass-panel"
                            onClick={() => onConfirm(intent.id as any)}
                        >
                            <span className="intent-icon">{intent.icon}</span>
                            <div className="intent-text">
                                <span className="intent-label">{intent.label}</span>
                                <span className="intent-desc">{intent.desc}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>{t.intention.proceed}</button>
                </div>
            </div>
        </div>
    );
}
