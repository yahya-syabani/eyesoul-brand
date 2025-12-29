'use client'

import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { PromotionalPageType } from '@/type/PromotionalPageType';

interface ModalPromotionContextProps {
    children: ReactNode;
}

interface ModalPromotionContextValue {
    selectedPromotion: PromotionalPageType | null;
    openPromotion: (promotion: PromotionalPageType) => void;
    closePromotion: () => void;
}

const ModalPromotionContext = createContext<ModalPromotionContextValue | undefined>(undefined);

export const ModalPromotionProvider: React.FC<ModalPromotionContextProps> = ({ children }) => {
    const [selectedPromotion, setSelectedPromotion] = useState<PromotionalPageType | null>(null);

    const openPromotion = useCallback((promotion: PromotionalPageType) => {
        setSelectedPromotion(promotion);
    }, []);

    const closePromotion = useCallback(() => {
        setSelectedPromotion(null);
    }, []);

    const contextValue = useMemo(() => ({ selectedPromotion, openPromotion, closePromotion }), [
        closePromotion,
        openPromotion,
        selectedPromotion,
    ]);

    return (
        <ModalPromotionContext.Provider value={contextValue}>
            {children}
        </ModalPromotionContext.Provider>
    );
};

export const useModalPromotionContext = () => {
    const context = useContext(ModalPromotionContext);
    if (!context) {
        throw new Error('useModalPromotionContext must be used within a ModalPromotionProvider');
    }
    return context;
};

