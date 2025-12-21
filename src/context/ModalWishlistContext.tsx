'use client'

import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';

interface ModalWishlistContextProps {
    children: ReactNode;
}

interface ModalWishlistContextValue {
    isModalOpen: boolean;
    openModalWishlist: () => void;
    closeModalWishlist: () => void;
}

const ModalWishlistContext = createContext<ModalWishlistContextValue | undefined>(undefined);

export const useModalWishlistContext = (): ModalWishlistContextValue => {
    const context = useContext(ModalWishlistContext);
    if (!context) {
        throw new Error('useModalWishlistContext must be used within a ModalWishlistProvider');
    }
    return context;
};

export const ModalWishlistProvider: React.FC<ModalWishlistContextProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModalWishlist = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closeModalWishlist = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const contextValue: ModalWishlistContextValue = useMemo(() => {
        return { isModalOpen, openModalWishlist, closeModalWishlist };
    }, [closeModalWishlist, isModalOpen, openModalWishlist]);

    return (
        <ModalWishlistContext.Provider value={contextValue}>
            {children}
        </ModalWishlistContext.Provider>
    );
};
