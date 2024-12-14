import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
    dismissTime: number;
    setDismissTime: (time: number) => void;
    onDismiss: (() => void)|null;
    setOnDismiss: (v:(()=>void)|null) => void;
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
    errorMessage: string | null;
    setErrorMessage: (message: string | null) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [dismissTime, setDismissTime] = useState<number>(1000);
    const [onDismiss, setOnDismiss] = useState<(() => void) | null>(null);

    return (
        <NotificationContext.Provider value={{ dismissTime, setDismissTime, onDismiss, setOnDismiss ,successMessage, setSuccessMessage, errorMessage, setErrorMessage }}>
            {children}
        </NotificationContext.Provider>
    );
};