'use client'

// CompareContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { ProductType } from '@/type/ProductType';
import { safeJsonParse, safeJsonStringify, safeStorageGet, safeStorageSet } from '@/utils/localStorage';

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

const sanitizeCompareItems = (value: unknown): CompareItem[] => {
    if (!Array.isArray(value)) return [];
    return value
        .filter((item): item is { id: unknown } => typeof item === 'object' && item !== null && 'id' in item)
        .map((item) => {
            const anyItem = item as any;
            const id = typeof anyItem.id === 'string' ? anyItem.id : '';
            if (!id) return null;
            return { ...anyItem, id } as CompareItem;
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
        const raw = safeStorageGet(COMPARE_STORAGE_KEY);
        if (raw.ok) {
            const parsed = safeJsonParse<unknown>(raw.value);
            if (parsed.ok) {
                dispatch({ type: 'LOAD_COMPARE', payload: sanitizeCompareItems(parsed.value) });
            }
        }
        hasHydratedRef.current = true;
    }, []);

    useEffect(() => {
        if (!hasHydratedRef.current) return;
        const json = safeJsonStringify(compareState.compareArray);
        if (json.ok) safeStorageSet(COMPARE_STORAGE_KEY, json.value);
    }, [compareState.compareArray]);

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
