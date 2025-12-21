'use client'

import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';

interface ModalSearchContextProps {
    children: ReactNode;
}

interface ModalSearchContextValue {
    isModalOpen: boolean;
    openModalSearch: () => void;
    closeModalSearch: () => void;
}

const ModalSearchContext = createContext<ModalSearchContextValue | undefined>(undefined);

export const useModalSearchContext = (): ModalSearchContextValue => {
    const context = useContext(ModalSearchContext);
    if (!context) {
        throw new Error('useModalSearchContext must be used within a ModalSearchProvider');
    }
    return context;
};

export const ModalSearchProvider: React.FC<ModalSearchContextProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModalSearch = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closeModalSearch = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const contextValue: ModalSearchContextValue = useMemo(() => {
        return { isModalOpen, openModalSearch, closeModalSearch };
    }, [closeModalSearch, isModalOpen, openModalSearch]);

    return (
        <ModalSearchContext.Provider value={contextValue}>
            {children}
        </ModalSearchContext.Provider>
    );
};
