'use client'

import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';

interface ModalCartContextProps {
    children: ReactNode;
}

interface ModalCartContextValue {
    isModalOpen: boolean;
    openModalCart: () => void;
    closeModalCart: () => void;
}

const ModalCartContext = createContext<ModalCartContextValue | undefined>(undefined);

export const useModalCartContext = (): ModalCartContextValue => {
    const context = useContext(ModalCartContext);
    if (!context) {
        throw new Error('useModalCartContext must be used within a ModalCartProvider');
    }
    return context;
};

export const ModalCartProvider: React.FC<ModalCartContextProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModalCart = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closeModalCart = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const contextValue: ModalCartContextValue = useMemo(() => {
        return { isModalOpen, openModalCart, closeModalCart };
    }, [closeModalCart, isModalOpen, openModalCart]);

    return (
        <ModalCartContext.Provider value={contextValue}>
            {children}
        </ModalCartContext.Provider>
    );
};
