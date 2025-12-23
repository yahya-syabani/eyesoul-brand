'use client'

// CompareContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { ProductType } from '@/type/ProductType';
import { useDebouncedEffect } from '@/hooks/useDebouncedEffect';
import { readPersistedArray, writePersistedArray } from '@/utils/persistedState';

interface CompareItem extends ProductType {
}

interface CompareState {
    compareArray: CompareItem[]
}

type CompareAction =
    | { type: 'ADD_TO_COMPARE'; payload: ProductType }
    | { type: 'REMOVE_FROM_COMPARE'; payload: string }
    | { type: 'LOAD_COMPARE'; payload: CompareItem[] }
    | { type: 'CLEAR_COMPARE' }

interface CompareContextProps {
    compareState: CompareState;
    addToCompare: (item: ProductType) => void;
    removeFromCompare: (itemId: string) => void;
    clearCompare: () => void;
}

const CompareContext = createContext<CompareContextProps | undefined>(undefined);

const COMPARE_STORAGE_KEY = 'anvogue_compare_v1';

type PartialCompareItem = Partial<CompareItem> & { id?: unknown }

const sanitizeCompareItems = (value: unknown): CompareItem[] => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => {
            if (typeof item !== 'object' || item === null) return null;
            const candidate = item as PartialCompareItem;
            const id = typeof candidate.id === 'string' ? candidate.id : '';
            if (!id) return null;
            return { ...candidate, id } as CompareItem;
        })
        .filter((x): x is CompareItem => x !== null);
};

const CompareReducer = (state: CompareState, action: CompareAction): CompareState => {
    switch (action.type) {
        case 'ADD_TO_COMPARE':
            const newItem: CompareItem = { ...action.payload };
            return {
                ...state,
                compareArray: [...state.compareArray, newItem],
            };
        case 'REMOVE_FROM_COMPARE':
            return {
                ...state,
                compareArray: state.compareArray.filter((item) => item.id !== action.payload),
            };
        case 'LOAD_COMPARE':
            return {
                ...state,
                compareArray: action.payload,
            };
        case 'CLEAR_COMPARE':
            return {
                ...state,
                compareArray: [],
            };
        default:
            return state;
    }
};

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [compareState, dispatch] = useReducer(CompareReducer, { compareArray: [] });
    const hasHydratedRef = useRef(false);

    useEffect(() => {
        const items = readPersistedArray<CompareItem>(COMPARE_STORAGE_KEY, sanitizeCompareItems);
        dispatch({ type: 'LOAD_COMPARE', payload: items });
        hasHydratedRef.current = true;
    }, []);

    useDebouncedEffect(() => {
        if (!hasHydratedRef.current) return;
        writePersistedArray(COMPARE_STORAGE_KEY, compareState.compareArray);
    }, [compareState.compareArray], 300);

    const addToCompare = useCallback((item: ProductType) => {
        dispatch({ type: 'ADD_TO_COMPARE', payload: item });
    }, []);

    const removeFromCompare = useCallback((itemId: string) => {
        dispatch({ type: 'REMOVE_FROM_COMPARE', payload: itemId });
    }, []);

    const clearCompare = useCallback(() => {
        dispatch({ type: 'CLEAR_COMPARE' });
    }, []);

    const contextValue = useMemo(() => {
        return { compareState, addToCompare, removeFromCompare, clearCompare };
    }, [addToCompare, clearCompare, compareState, removeFromCompare]);

    return (
        <CompareContext.Provider value={contextValue}>
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
};
