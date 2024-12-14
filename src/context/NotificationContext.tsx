import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    return (
        <NotificationContext.Provider value={{ errorMessage, setErrorMessage }}>
    {children}
    </NotificationContext.Provider>
);
};
