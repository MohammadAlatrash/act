'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type UIMode = 'WarRoom' | 'MonkMode';

interface FocusContextType {
    isFocusActive: boolean;
    uiMode: UIMode;
    startFocus: (taskId: string) => void;
    stopFocus: () => void;
    toggleUIMode: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: ReactNode }) {
    const [isFocusActive, setIsFocusActive] = useState(false);
    const [uiMode, setUiMode] = useState<UIMode>('WarRoom');
    const [activeFocusTaskId, setActiveFocusTaskId] = useLocalStorage<string | null>('active-focus-task', null);

    const startFocus = (taskId: string) => {
        setIsFocusActive(true);
        setActiveFocusTaskId(taskId);
        setUiMode('MonkMode');
    };

    const stopFocus = () => {
        setIsFocusActive(false);
        setActiveFocusTaskId(null);
        setUiMode('WarRoom');
    };

    const toggleUIMode = () => {
        setUiMode(prev => prev === 'WarRoom' ? 'MonkMode' : 'WarRoom');
    };

    return (
        <FocusContext.Provider value={{ isFocusActive, uiMode, startFocus, stopFocus, toggleUIMode }}>
            {children}
        </FocusContext.Provider>
    );
}

export function useFocus() {
    const context = useContext(FocusContext);
    if (context === undefined) {
        throw new Error('useFocus must be used within a FocusProvider');
    }
    return context;
}
