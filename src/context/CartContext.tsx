'use client'

// CartContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { ProductType } from '@/type/ProductType';
import { safeJsonParse, safeJsonStringify, safeStorageGet, safeStorageSet } from '@/utils/localStorage';
import { useDebouncedEffect } from '@/hooks/useDebouncedEffect';

interface CartItem extends ProductType {
    quantity: number
    selectedSize: string
    selectedColor: string
}

interface CartState {
    cartArray: CartItem[]
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: ProductType }
    | { type: 'REMOVE_FROM_CART'; payload: string }
    | {
        type: 'UPDATE_CART'; payload: {
            itemId: string; quantity: number, selectedSize: string, selectedColor: string
        }
    }
    | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextProps {
    cartState: CartState;
    addToCart: (item: ProductType) => void;
    removeFromCart: (itemId: string) => void;
    updateCart: (itemId: string, quantity: number, selectedSize: string, selectedColor: string) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const CART_STORAGE_KEY = 'anvogue_cart_v1';

const sanitizeCartItems = (value: unknown): CartItem[] => {
    if (!Array.isArray(value)) return [];
    return value
        .filter((item): item is Partial<CartItem> & { id: unknown } => typeof item === 'object' && item !== null && 'id' in item)
        .map((item) => {
            const anyItem = item as any;
            const id = typeof anyItem.id === 'string' ? anyItem.id : '';
            const quantity = Number.isFinite(anyItem.quantity) ? Math.max(1, Math.floor(anyItem.quantity)) : 1;
            const selectedSize = typeof anyItem.selectedSize === 'string' ? anyItem.selectedSize : '';
            const selectedColor = typeof anyItem.selectedColor === 'string' ? anyItem.selectedColor : '';
            if (!id) return null;
            return { ...anyItem, id, quantity, selectedSize, selectedColor } as CartItem;
        })
        .filter((x): x is CartItem => x !== null);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const newItem: CartItem = { ...action.payload, quantity: 1, selectedSize: '', selectedColor: '' };
            return {
                ...state,
                cartArray: [...state.cartArray, newItem],
            };
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartArray: state.cartArray.filter((item) => item.id !== action.payload),
            };
        case 'UPDATE_CART':
            return {
                ...state,
                cartArray: state.cartArray.map((item) =>
                    item.id === action.payload.itemId
                        ? {
                            ...item,
                            quantity: action.payload.quantity,
                            selectedSize: action.payload.selectedSize,
                            selectedColor: action.payload.selectedColor
                        }
                        : item
                ),
            };
        case 'LOAD_CART':
            return {
                ...state,
                cartArray: action.payload,
            };
        default:
            return state;
    }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartState, dispatch] = useReducer(cartReducer, { cartArray: [] });
    const hasHydratedRef = useRef(false);

    useEffect(() => {
        const raw = safeStorageGet(CART_STORAGE_KEY);
        if (raw.ok) {
            const parsed = safeJsonParse<unknown>(raw.value);
            if (parsed.ok) {
                dispatch({ type: 'LOAD_CART', payload: sanitizeCartItems(parsed.value) });
            }
        }
        hasHydratedRef.current = true;
    }, []);

    useDebouncedEffect(() => {
        if (!hasHydratedRef.current) return;
        const json = safeJsonStringify(cartState.cartArray);
        if (!json.ok) return;
        const res = safeStorageSet(CART_STORAGE_KEY, json.value);
        if (!res.ok) {
            // eslint-disable-next-line no-console
            console.warn('Failed to persist cart to localStorage', res.error);
        }
    }, [cartState.cartArray], 300);

    const addToCart = useCallback((item: ProductType) => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
    }, []);

    const removeFromCart = useCallback((itemId: string) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    }, []);

    const updateCart = useCallback((itemId: string, quantity: number, selectedSize: string, selectedColor: string) => {
        dispatch({ type: 'UPDATE_CART', payload: { itemId, quantity, selectedSize, selectedColor } });
    }, []);

    const contextValue = useMemo(() => {
        return { cartState, addToCart, removeFromCart, updateCart };
    }, [addToCart, cartState, removeFromCart, updateCart]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
