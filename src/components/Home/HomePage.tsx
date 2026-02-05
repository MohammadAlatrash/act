import React from 'react';
import RitualSovereign from './RitualSovereign';
import EnergyMonitorWidget from './EnergyMonitorWidget';
import RegionalEcosystem from './RegionalEcosystem';
import SovereignActivity from './SovereignActivity';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SovereignAnchor } from '../../types';
import './Home.css';
import './SovereignActivity.css';

export default function HomePage() {
  const [anchors] = useLocalStorage<SovereignAnchor[]>('sovereign-anchors', [
    { id: 'fajr', name: 'Fajr Anchor (الفجر)', startTime: '05:00', durationMinutes: 30, type: 'Spiritual' },
    { id: 'dhuhr', name: 'Dhuhr Anchor (الظهر)', startTime: '12:00', durationMinutes: 30, type: 'Spiritual' },
    { id: 'asr', name: 'Asr Anchor (العصر)', startTime: '15:30', durationMinutes: 30, type: 'Spiritual' },
    { id: 'maghrib', name: 'Maghrib Anchor (المغرب)', startTime: '18:00', durationMinutes: 30, type: 'Spiritual' },
    { id: 'isha', name: 'Isha Anchor (العشاء)', startTime: '19:30', durationMinutes: 30, type: 'Spiritual' }
  ]);

  const totalAnchorMinutes = anchors.reduce((acc, a) => acc + a.durationMinutes, 0);
  const anchorHours = (totalAnchorMinutes / 60).toFixed(1);
  const sleepHours = 8;
  const workHours = 6;
  const marginHours = 24 - sleepHours - workHours - Number(anchorHours);

  // Chart percentages (out of 100)
  const sleepP = (sleepHours / 24) * 100;
  const workP = (workHours / 24) * 100;
  const anchorP = (Number(anchorHours) / 24) * 100;
  const marginP = (marginHours / 24) * 100;
  return (
    <div className="home-dashboard">
      <div className="dashboard-top-row">
        <RitualSovereign />
        <EnergyMonitorWidget />
      </div>
      <section className="stats-grid">
        <div className="stat-card glass-panel glow-border">
          <h3>Daily Focus</h3>
          <div className="stat-value">85%</div>
          <p>Progress towards daily target</p>
        </div>
        <div className="stat-card glass-panel">
          <h3>Hours Worked</h3>
          <div className="stat-value">6.5 <span className="unit">hrs</span></div>
          <p>Target: 8.0 hrs</p>
        </div>
        <div className="stat-card glass-panel">
          <h3>Sleep Quality</h3>
          <div className="stat-value">7.2 <span className="unit">hrs</span></div>
          <p>Optimal recovery achieved</p>
        </div>
        <div className="stat-card glass-panel">
          <h3>Next Sprint</h3>
          <div className="stat-value">12 <span className="unit">days</span></div>
          <p>Quarterly milestone ahead</p>
        </div>
      </section>

      <section className="strategic-overview">
        <div className="active-goals glass-panel">
          <h2 className="gradient-text">Strategic Targets</h2>
          <div className="goal-item">
            <div className="goal-info">
              <span>Yearly Expansion</span>
              <span>45%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div className="goal-item">
            <div className="goal-info">
              <span>Skill Mastery (Next.js)</span>
              <span>80%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>

        <div className="time-budget-module glass-panel glow-border">
          <h2 className="gradient-text">Time Budget (ميزانية الوقت)</h2>
          <div className="budget-container">
            <div className="budget-chart">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle-fill sleep" strokeDasharray={`${sleepP}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle-fill work" strokeDasharray={`${workP}, 100`} strokeDashoffset={`-${sleepP}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle-fill spiritual" strokeDasharray={`${anchorP}, 100`} strokeDashoffset={`-${sleepP + workP}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle-fill margin" strokeDasharray={`${marginP}, 100`} strokeDashoffset={`-${sleepP + workP + anchorP}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="budget-center">
                <span className="balance-value">{marginHours.toFixed(1)}</span>
                <span className="balance-label">Hrs Left</span>
              </div>
            </div>
            <div className="budget-legend">
              <div className="legend-item"><span className="dot sleep"></span> Sleep ({sleepHours}h)</div>
              <div className="legend-item"><span className="dot work"></span> Fixed ({workHours}h)</div>
              <div className="legend-item"><span className="dot spiritual"></span> Constants ({anchorHours}h)</div>
              <div className="legend-item"><span className="dot margin"></span> Strategic ({marginHours.toFixed(1)}h)</div>
            </div>
          </div>
          <p className="text-secondary text-center mt-4 italic">"Time is a trust (أمانة). Barakah flows through the constants."</p>
        </div>

        <div className="time-waste-analysis glass-panel">
          <h2 className="gradient-text">Leakage Analysis</h2>
          <div className="leak-chart">
            <div className="leak-item" style={{ height: '60%' }} title="Social Media"></div>
            <div className="leak-item" style={{ height: '30%' }} title="Context Switching"></div>
            <div className="leak-item" style={{ height: '10%' }} title="Others"></div>
          </div>
          <p className="text-muted text-center mt-4">Total Leakage today: 1.2 hrs</p>
        </div>
      </section>

      <SovereignActivity />
      <RegionalEcosystem />
    </div>
  );
}
