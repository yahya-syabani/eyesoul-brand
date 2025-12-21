'use client'

import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';

interface ModalCompareContextProps {
    children: ReactNode;
}

interface ModalCompareContextValue {
    isModalOpen: boolean;
    openModalCompare: () => void;
    closeModalCompare: () => void;
}

const ModalCompareContext = createContext<ModalCompareContextValue | undefined>(undefined);

export const useModalCompareContext = (): ModalCompareContextValue => {
    const context = useContext(ModalCompareContext);
    if (!context) {
        throw new Error('useModalCompareContext must be used within a ModalCompareProvider');
    }
    return context;
};

export const ModalCompareProvider: React.FC<ModalCompareContextProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModalCompare = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closeModalCompare = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const contextValue: ModalCompareContextValue = useMemo(() => {
        return { isModalOpen, openModalCompare, closeModalCompare };
    }, [closeModalCompare, isModalOpen, openModalCompare]);

    return (
        <ModalCompareContext.Provider value={contextValue}>
            {children}
        </ModalCompareContext.Provider>
    );
};
