import React, { useState } from 'react';
import './Reports.css';

export default function ReportsAnalytics() {
    const [interval, setInterval] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly'>('Weekly');

    return (
        <div className="reports-manager glass-panel">
            <div className="reports-header">
                <h2 className="gradient-text">Intelligence Analytics</h2>
                <div className="interval-picker">
                    {['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map(i => (
                        <button
                            key={i}
                            className={`interval-btn ${interval === i ? 'active' : ''}`}
                            onClick={() => setInterval(i as any)}
                        >
                            {i}
                        </button>
                    ))}
                </div>
            </div>

            <div className="analytics-grid">
                <section className="chart-container glass-panel">
                    <h3>Work Intensity ({interval})</h3>
                    <div className="bar-chart-placeholder">
                        {[60, 80, 40, 95, 70, 50, 85].map((h, idx) => (
                            <div key={idx} className="bar-wrapper">
                                <div className="bar" style={{ height: `${h}%` }}></div>
                                <span className="bar-label">{idx + 1}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="insight-cards">
                    <div className="insight-card glass-panel glow-border">
                        <h4>Focus Efficiency</h4>
                        <div className="insight-value">92%</div>
                        <p>You are most productive between 9 AM and 1 PM.</p>
                    </div>
                    <div className="insight-card glass-panel">
                        <h4>Total Leakage</h4>
                        <div className="insight-value text-error">4.2 hrs</div>
                        <p>Main leak source: Context Switching.</p>
                    </div>
                    <div className="insight-card glass-panel">
                        <h4>Recovery Rate</h4>
                        <div className="insight-value text-success">High</div>
                        <p>Sleep quality improved by 15% this week.</p>
                    </div>
                </section>

                <section className="improvement-plan glass-panel">
                    <h3>Strategic Enhancements</h3>
                    <ul className="enhancement-list">
                        <li>
                            <strong>Time Boxing:</strong> Increase focus blocks for "Global Market" project.
                        </li>
                        <li>
                            <strong>Sleep Optimization:</strong> Reduce deep work after 9 PM to improve REM stages.
                        </li>
                        <li>
                            <strong>Automation:</strong> Automate data entry for recurring finance tasks.
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
