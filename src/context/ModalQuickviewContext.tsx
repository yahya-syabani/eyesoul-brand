'use client'

// ModalQuickviewContext.tsx
import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { ProductType } from '@/type/ProductType';

interface ModalQuickviewContextProps {
    children: ReactNode;
}

interface ModalQuickviewContextValue {
    selectedProduct: ProductType | null;
    openQuickview: (product: ProductType) => void;
    setQuickviewQuantityPurchase: (quantityPurchase: number) => void;
    closeQuickview: () => void;
}

const ModalQuickviewContext = createContext<ModalQuickviewContextValue | undefined>(undefined);

export const ModalQuickviewProvider: React.FC<ModalQuickviewContextProps> = ({ children }) => {
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

    const openQuickview = useCallback((product: ProductType) => {
        setSelectedProduct({ ...product, quantityPurchase: 1 });
    }, []);

    const setQuickviewQuantityPurchase = useCallback((quantityPurchase: number) => {
        setSelectedProduct((prev) => {
            if (!prev) return prev
            return { ...prev, quantityPurchase }
        })
    }, []);

    const closeQuickview = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    const contextValue = useMemo(() => ({ selectedProduct, openQuickview, setQuickviewQuantityPurchase, closeQuickview }), [
        closeQuickview,
        openQuickview,
        setQuickviewQuantityPurchase,
        selectedProduct,
    ]);

    return (
        <ModalQuickviewContext.Provider value={contextValue}>
            {children}
        </ModalQuickviewContext.Provider>
    );
};

export const useModalQuickviewContext = () => {
    const context = useContext(ModalQuickviewContext);
    if (!context) {
        throw new Error('useModalQuickviewContext must be used within a ModalQuickviewProvider');
    }
    return context;
};
