import React, { useState } from 'react';
import './Rituals.css';

interface RitualStep {
    title: string;
    description: string;
    action: string;
}

const MORNING_LAUNCH: RitualStep[] = [
    { title: 'Zero-G Awareness', description: 'Review your sleep quality and energy peaks for the day.', action: 'Check Biological Monitor' },
    { title: 'Mission Alignment', description: 'Select the one strategic goal that must move forward today.', action: 'Review Strategic Vision' },
    { title: 'Operation Lock-in', description: 'Time-block your deep work session during your focus peak.', action: 'Schedule Task' }
];

const EVENING_SHUTDOWN: RitualStep[] = [
    { title: 'Performance Audit', description: 'log actual hours vs estimates and identify time leakage.', action: 'Update Tasks' },
    { title: 'Cognitive Offload', description: 'Write down any lingering ideas to "dump" your brain for sleep.', action: 'Note Capture' },
    { title: 'Recovery Commitment', description: 'Set your target wind-down time to clear sleep debt.', action: 'Set Sleep Target' }
];

export default function RitualSovereign() {
    const [type, setType] = useState<'Launch' | 'Shutdown' | null>(null);
    const [step, setStep] = useState(0);

    const activeRitual = type === 'Launch' ? MORNING_LAUNCH : EVENING_SHUTDOWN;

    if (!type) {
        return (
            <div className="ritual-launcher glass-panel glow-border">
                <h3>Operational Rituals</h3>
                <p className="text-secondary">Standardize your focus. Align your day.</p>
                <div className="launcher-actions">
                    <button className="ritual-btn launch" onClick={() => setType('Launch')}>Initiate Morning Launch</button>
                    <button className="ritual-btn shutdown" onClick={() => setType('Shutdown')}>Initiate Evening Shutdown</button>
                </div>
            </div>
        );
    }

    const currentStep = activeRitual[step];

    return (
        <div className="ritual-overlay glass-panel glow-border">
            <div className="ritual-progress">
                {activeRitual.map((_, i) => (
                    <div key={i} className={`progress-dot ${i <= step ? 'active' : ''}`}></div>
                ))}
            </div>
            <div className="ritual-content">
                <span className="step-count">Step {step + 1} of {activeRitual.length}</span>
                <h2>{currentStep.title}</h2>
                <p>{currentStep.description}</p>
                <div className="action-requirement">
                    <span>Required Action:</span> <strong>{currentStep.action}</strong>
                </div>
            </div>
            <div className="ritual-footer">
                <button className="cancel-btn" onClick={() => { setType(null); setStep(0); }}>Abort</button>
                <button className="next-btn" onClick={() => {
                    if (step < activeRitual.length - 1) {
                        setStep(step + 1);
                    } else {
                        setType(null);
                        setStep(0);
                    }
                }}>
                    {step === activeRitual.length - 1 ? 'Mission Locked' : 'Next Protocol'}
                </button>
            </div>
        </div>
    );
}
