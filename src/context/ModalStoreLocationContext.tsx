'use client'

import React, { createContext, useCallback, useContext, useMemo, useState, useRef, useEffect, ReactNode } from 'react';
import { StoreLocationType } from '@/type/StoreLocationType';

interface ModalStoreLocationContextProps {
    children: ReactNode;
}

interface ModalStoreLocationContextValue {
    isModalOpen: boolean;
    stores: StoreLocationType[];
    expandedStoreIds: Set<string>;
    selectedProvince: string | null;
    isLoadingStores: boolean;
    openModalWithAllStores: (stores: StoreLocationType[]) => void;
    openModalWithStore: (stores: StoreLocationType[], storeId: string) => void;
    toggleStoreExpand: (storeId: string) => void;
    setSelectedProvince: (province: string | null) => void;
    setIsLoadingStores: (loading: boolean) => void;
    closeModalStoreLocation: () => void;
}

const ModalStoreLocationContext = createContext<ModalStoreLocationContextValue | undefined>(undefined);

export const useModalStoreLocationContext = (): ModalStoreLocationContextValue => {
    const context = useContext(ModalStoreLocationContext);
    if (!context) {
        throw new Error('useModalStoreLocationContext must be used within a ModalStoreLocationProvider');
    }
    return context;
};

export const ModalStoreLocationProvider: React.FC<ModalStoreLocationContextProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stores, setStores] = useState<StoreLocationType[]>([]);
    const [expandedStoreIds, setExpandedStoreIds] = useState<Set<string>>(new Set());
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [isLoadingStores, setIsLoadingStores] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const openModalWithAllStores = useCallback((storeList: StoreLocationType[]) => {
        // Clear any pending timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setStores(storeList);
        setExpandedStoreIds(new Set()); // All collapsed by default
        setSelectedProvince(null); // Reset province selection
        setIsModalOpen(true);
    }, []);

    const openModalWithStore = useCallback((storeList: StoreLocationType[], storeId: string) => {
        // Clear any pending timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        const store = storeList.find(s => s.id === storeId);
        setStores(storeList);
        setExpandedStoreIds(new Set([storeId])); // Expand the specific store
        setSelectedProvince(store?.province || null); // Select the province of the store
        setIsModalOpen(true);
    }, []);

    const toggleStoreExpand = useCallback((storeId: string) => {
        setExpandedStoreIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(storeId)) {
                newSet.delete(storeId);
            } else {
                newSet.add(storeId);
            }
            return newSet;
        });
    }, []);

    const closeModalStoreLocation = useCallback(() => {
        setIsModalOpen(false);
        // Clear stores and expanded items after animation completes
        timeoutRef.current = setTimeout(() => {
            setStores([]);
            setExpandedStoreIds(new Set());
            setSelectedProvince(null);
            timeoutRef.current = null;
        }, 500); // Match CSS transition duration (0.5s)
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const contextValue: ModalStoreLocationContextValue = useMemo(() => {
        return { 
            isModalOpen, 
            stores, 
            expandedStoreIds,
            selectedProvince,
            isLoadingStores,
            openModalWithAllStores, 
            openModalWithStore, 
            toggleStoreExpand,
            setSelectedProvince,
            setIsLoadingStores,
            closeModalStoreLocation 
        };
    }, [closeModalStoreLocation, isModalOpen, openModalWithAllStores, openModalWithStore, stores, expandedStoreIds, selectedProvince, isLoadingStores, toggleStoreExpand]);

    return (
        <ModalStoreLocationContext.Provider value={contextValue}>
            {children}
        </ModalStoreLocationContext.Provider>
    );
};
