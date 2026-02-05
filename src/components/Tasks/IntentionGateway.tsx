'use client';

import React from 'react';
import './IntentionGateway.css';

interface IntentionGatewayProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (intent: 'Ihsan' | 'Nafa' | 'Rizq' | 'Itqan') => void;
    taskTitle: string;
}

export default function IntentionGateway({ isOpen, onClose, onConfirm, taskTitle }: IntentionGatewayProps) {
    if (!isOpen) return null;

    const intentions = [
        { id: 'Ihsan', label: 'إعمار الأرض / إحسان', desc: 'Excellence & Building the Earth', icon: '🌍' },
        { id: 'Nafa', label: 'نفع الأمة', desc: 'Benefit to the Ummah', icon: '🤝' },
        { id: 'Rizq', label: 'طلب الرزق الحلال', desc: 'Seeking Halal Sustenance', icon: '⚖️' },
        { id: 'Itqan', label: 'إتقان العمل لله', desc: 'Mastery for the sake of Allah', icon: '💎' }
    ];

    return (
        <div className="intention-overlay">
            <div className="intention-modal glass-panel glow-border animate-scale-up">
                <div className="modal-header">
                    <h2 className="gradient-text">Renew Intention | تجديد النية</h2>
                    <p className="text-secondary">Aligning mission: <strong>{taskTitle}</strong></p>
                </div>

                <p className="verse-quote italic">"قل إن صلاتي ونسكي ومحياي ومماتي لله رب العالمين"</p>

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
                    <button className="cancel-btn" onClick={onClose}>Proceed without Alignment</button>
                </div>
            </div>
        </div>
    );
}
