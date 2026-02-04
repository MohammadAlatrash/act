'use client';

import React, { useState, useEffect } from 'react';
import HomePage from '../Home/HomePage';
import TaskManager from '../Tasks/TaskManager';
import BiologicalMonitor from '../Biology/BiologicalMonitor';
import StrategyManager from '../Strategy/StrategyManager';
import ReportsAnalytics from '../Reports/ReportsAnalytics';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { calculateSovereignRank } from '../../lib/gamification';
import { Task } from '../../types';
import './Dashboard.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [tasks] = useLocalStorage<Task[]>('tasks', []);
    const [habits] = useLocalStorage<any[]>('habits', []);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const rankStats = calculateSovereignRank(tasks, habits);

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard': return <HomePage />;
            case 'Strategy': return <StrategyManager />;
            case 'Tasks': return <TaskManager />;
            case 'Biological': return <BiologicalMonitor />;
            case 'Reports': return <ReportsAnalytics />;
            default: return <div className="glass-panel p-10">Module coming soon...</div>;
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    <h2 className="gradient-text">ACT Strategic</h2>
                </div>
                <nav className="sidebar-nav">
                    {['Dashboard', 'Strategy', 'Tasks', 'Biological', 'Reports'].map(tab => (
                        <button
                            key={tab}
                            className={`nav-item ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </aside>
            <main className="main-content">
                <header className="main-header glass-panel">
                    <div className="header-info">
                        <h1>{activeTab} Overview</h1>
                        <p className="text-secondary">Focus on the target. Stay to the point.</p>
                    </div>
                    <div className="user-profile">
                        <div className="rank-indicator">
                            <span className="rank-label">{mounted ? rankStats.rank : '---'}</span>
                            <div className="rank-progress-mini">
                                <div className="mini-fill" style={{ width: `${mounted ? rankStats.nextRankProgress : 0}%` }}></div>
                            </div>
                        </div>
                        <span className="status-indicator online"></span>
                        <span>System Owner</span>
                    </div>
                </header>
                <section className="content-area">
                    {renderContent()}
                </section>
            </main>
        </div>
    );
}
