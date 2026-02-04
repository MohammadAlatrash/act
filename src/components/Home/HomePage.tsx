import React from 'react';
import RitualSovereign from './RitualSovereign';
import './Home.css';

export default function HomePage() {
  return (
    <div className="home-dashboard">
      <RitualSovereign />
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

        <div className="time-waste-analysis glass-panel">
          <h2 className="gradient-text">Leakage Analysis</h2>
          <div className="leak-chart">
            {/* Visual placeholder for time leakage */}
            <div className="leak-item" style={{ height: '60%' }} title="Social Media"></div>
            <div className="leak-item" style={{ height: '30%' }} title="Context Switching"></div>
            <div className="leak-item" style={{ height: '10%' }} title="Others"></div>
          </div>
          <p className="text-muted text-center mt-4">Total Leakage today: 1.2 hrs</p>
        </div>
      </section>
    </div>
  );
}
