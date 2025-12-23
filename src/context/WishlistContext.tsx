'use client'

// WishlistContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { ProductType } from '@/type/ProductType';
import { useDebouncedEffect } from '@/hooks/useDebouncedEffect';
import { readPersistedArray, writePersistedArray } from '@/utils/persistedState';

interface WishlistItem extends ProductType {
}

interface WishlistState {
    wishlistArray: WishlistItem[]
}

type WishlistAction =
    | { type: 'ADD_TO_WISHLIST'; payload: ProductType }
    | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
    | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }

interface WishlistContextProps {
    wishlistState: WishlistState;
    addToWishlist: (item: ProductType) => void;
    removeFromWishlist: (itemId: string) => void;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'anvogue_wishlist_v1';

type PartialWishlistItem = Partial<WishlistItem> & { id?: unknown }

const sanitizeWishlistItems = (value: unknown): WishlistItem[] => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => {
            if (typeof item !== 'object' || item === null) return null;
            const candidate = item as PartialWishlistItem;
            const id = typeof candidate.id === 'string' ? candidate.id : '';
            if (!id) return null;
            return { ...candidate, id } as WishlistItem;
        })
        .filter((x): x is WishlistItem => x !== null);
};

const WishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
    switch (action.type) {
        case 'ADD_TO_WISHLIST':
            const newItem: WishlistItem = { ...action.payload };
            return {
                ...state,
                wishlistArray: [...state.wishlistArray, newItem],
            };
        case 'REMOVE_FROM_WISHLIST':
            return {
                ...state,
                wishlistArray: state.wishlistArray.filter((item) => item.id !== action.payload),
            };
        case 'LOAD_WISHLIST':
            return {
                ...state,
                wishlistArray: action.payload,
            };
        default:
            return state;
    }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistState, dispatch] = useReducer(WishlistReducer, { wishlistArray: [] });
    const hasHydratedRef = useRef(false);

    useEffect(() => {
        const items = readPersistedArray<WishlistItem>(WISHLIST_STORAGE_KEY, sanitizeWishlistItems);
        dispatch({ type: 'LOAD_WISHLIST', payload: items });
        hasHydratedRef.current = true;
    }, []);

    useDebouncedEffect(() => {
        if (!hasHydratedRef.current) return;
        writePersistedArray(WISHLIST_STORAGE_KEY, wishlistState.wishlistArray);
    }, [wishlistState.wishlistArray], 300);

    const addToWishlist = useCallback((item: ProductType) => {
        dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
    }, []);

    const removeFromWishlist = useCallback((itemId: string) => {
        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: itemId });
    }, []);

    const contextValue = useMemo(() => {
        return { wishlistState, addToWishlist, removeFromWishlist };
    }, [addToWishlist, removeFromWishlist, wishlistState]);

    return (
        <WishlistContext.Provider value={contextValue}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
