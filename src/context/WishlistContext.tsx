'use client'

// WishlistContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { ProductType } from '@/type/ProductType';
import { safeJsonParse, safeJsonStringify, safeStorageGet, safeStorageSet } from '@/utils/localStorage';
import { useDebouncedEffect } from '@/hooks/useDebouncedEffect';

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

const sanitizeWishlistItems = (value: unknown): WishlistItem[] => {
    if (!Array.isArray(value)) return [];
    return value
        .filter((item): item is { id: unknown } => typeof item === 'object' && item !== null && 'id' in item)
        .map((item) => {
            const anyItem = item as any;
            const id = typeof anyItem.id === 'string' ? anyItem.id : '';
            if (!id) return null;
            return { ...anyItem, id } as WishlistItem;
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
        const raw = safeStorageGet(WISHLIST_STORAGE_KEY);
        if (raw.ok) {
            const parsed = safeJsonParse<unknown>(raw.value);
            if (parsed.ok) {
                dispatch({ type: 'LOAD_WISHLIST', payload: sanitizeWishlistItems(parsed.value) });
            }
        }
        hasHydratedRef.current = true;
    }, []);

    useDebouncedEffect(() => {
        if (!hasHydratedRef.current) return;
        const json = safeJsonStringify(wishlistState.wishlistArray);
        if (!json.ok) return;
        const res = safeStorageSet(WISHLIST_STORAGE_KEY, json.value);
        if (!res.ok) {
            // eslint-disable-next-line no-console
            console.warn('Failed to persist wishlist to localStorage', res.error);
        }
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
