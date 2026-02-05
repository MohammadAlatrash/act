'use client';

import React, { useState, useEffect } from 'react';
import HomePage from '../Home/HomePage';
import TaskManager from '../Tasks/TaskManager';
import BiologicalMonitor from '../Biology/BiologicalMonitor';
import StrategyManager from '../Strategy/StrategyManager';
import InterrogativeLoop from '../Audit/InterrogativeLoop';
import ReportsAnalytics from '../Reports/ReportsAnalytics';
import SovereignSettings from '../Settings/SovereignSettings';
import TrusteeshipDashboard from '../Amanat/TrusteeshipDashboard';
import LanguageSwitcher from '../Settings/LanguageSwitcher';
import ThemeSwitcher from '../Settings/ThemeSwitcher';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useLanguage } from '../../context/LanguageContext';
import { calculateSovereignRank } from '../../lib/gamification';
import { Task } from '../../types';
import { useFocus } from '../../context/FocusContext';
import { predictFailureProbability } from '../../lib/intelligence';
import QuickCapture from '../Capture/QuickCapture';
import './Dashboard.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [tasks] = useLocalStorage<Task[]>('tasks', []);
    const [habits] = useLocalStorage<any[]>('habits', []);
    const [mounted, setMounted] = useState(false);
    const [globalAlert, setGlobalAlert] = useState<string | null>(null);

    const { uiMode, isFocusActive } = useFocus();
    useEffect(() => {
        setMounted(true);

        // Global Focus Sentinel
        let interval: NodeJS.Timeout;
        if (isFocusActive) {
            interval = setInterval(() => {
                if (Math.random() > 0.9) {
                    setGlobalAlert("Legacy Deviation Detected. Returning to Interrogative Loop...");
                    setTimeout(() => {
                        setActiveTab('Audit');
                        setGlobalAlert(null);
                    }, 3000);
                }
            }, 45000);
        }
        return () => clearInterval(interval);
    }, [isFocusActive]);

    const rankStats = calculateSovereignRank(tasks, habits);

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard': return <HomePage />;
            case 'Strategy': return <StrategyManager />;
            case 'Tasks': return <TaskManager />;
            case 'Biological': return <BiologicalMonitor />;
            case 'Audit': return <InterrogativeLoop />;
            case 'Reports':
                return <ReportsAnalytics />;
            case 'Amanat':
                return <TrusteeshipDashboard />;
            case 'Settings':
                return <SovereignSettings />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className={`dashboard-container ${uiMode === 'MonkMode' ? 'monk-mode' : ''}`}>
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    <h2 className="gradient-text">Athar | أثر</h2>
                </div>
                <nav className="sidebar-nav">
                    {['Dashboard', 'Strategy', 'Tasks', 'Biological', 'Audit', 'Reports', 'Amanat', 'Settings'].map(tab => (
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
                    <div className="header-left">
                        <h1>{t.dashboard.title}</h1>
                    </div>
                    <div className="header-right">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                        <div className="user-profile">
                            <div className="rank-badge">{rankStats.rank}</div>
                            <span>{rankStats.score} XP</span>
                        </div>
                    </div>
                </header>
                {globalAlert && (
                    <div className="global-sentinel-alert animate-slide-down">
                        <span className="icon">🛡️</span>
                        {globalAlert}
                    </div>
                )}
                <section className="content-area">
                    {renderContent()}
                </section>
                <QuickCapture />
            </main>
        </div>
    );
}
