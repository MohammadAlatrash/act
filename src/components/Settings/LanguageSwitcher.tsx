'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="language-switcher">
            <button
                className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
                onClick={() => setLanguage('ar')}
                title="العربية"
            >
                عربي
            </button>
            <button
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                title="English"
            >
                EN
            </button>
        </div>
    );
}
