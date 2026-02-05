'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './RegionalEcosystem.css';

export default function RegionalEcosystem() {
    const { t } = useLanguage();

    const opportunities = [
        { id: 1, title: 'MENA Tech summit', type: 'Networking', time: 'In 12 days' },
        { id: 2, title: 'Ihsan-Design Workshop', type: 'Growth', time: 'Tomorrow' },
        { id: 3, title: 'Dubai Strategic Hub', type: 'Expansion', time: 'Ongoing' }
    ];

    return (
        <div className="regional-ecosystem glass-panel glow-border">
            <div className="ecosystem-header">
                <h3>{t.regional.title}</h3>
                <span className="location-tag">📍 {t.regional.location}</span>
            </div>

            <div className="ecosystem-grid">
                <div className="al-falah-metric">
                    <span className="label">{t.regional.falahQuotient}</span>
                    <div className="falah-dial">
                        <svg viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="75, 100" />
                        </svg>
                        <span className="dial-val">75%</span>
                    </div>
                </div>

                <div className="opportunities-list">
                    <h4>{t.regional.opportunities}</h4>
                    {opportunities.map(op => (
                        <div key={op.id} className="opportunity-item">
                            <div className="op-info">
                                <strong>{op.title}</strong>
                                <span className="op-type">{op.type}</span>
                            </div>
                            <span className="op-time">{op.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="ecosystem-footer">
                <p className="italic text-secondary">{t.regional.quote}</p>
            </div>
        </div>
    );
}
