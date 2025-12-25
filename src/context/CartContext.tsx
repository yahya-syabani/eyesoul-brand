'use client'

// CartContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { ProductType } from '@/type/ProductType';
import { useDebouncedEffect } from '@/hooks/useDebouncedEffect';
import { readPersistedArray, writePersistedArray } from '@/utils/persistedState';
import { CART_STORAGE_KEY } from '@/lib/api-constants';

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

type PartialCartItem = Partial<CartItem> & { id?: unknown; quantity?: unknown; selectedSize?: unknown; selectedColor?: unknown }

const sanitizeCartItems = (value: unknown): CartItem[] => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => {
            if (typeof item !== 'object' || item === null) return null;
            const candidate = item as PartialCartItem;
            const id = typeof candidate.id === 'string' ? candidate.id : '';
            if (!id) return null;
            const quantity = Number.isFinite(candidate.quantity) ? Math.max(1, Math.floor(Number(candidate.quantity))) : 1;
            const selectedSize = typeof candidate.selectedSize === 'string' ? candidate.selectedSize : '';
            const selectedColor = typeof candidate.selectedColor === 'string' ? candidate.selectedColor : '';
            return { ...candidate, id, quantity, selectedSize, selectedColor } as CartItem;
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
        const items = readPersistedArray<CartItem>(CART_STORAGE_KEY, sanitizeCartItems);
        dispatch({ type: 'LOAD_CART', payload: items });
        hasHydratedRef.current = true;
    }, []);

    useDebouncedEffect(() => {
        if (!hasHydratedRef.current) return;
        writePersistedArray(CART_STORAGE_KEY, cartState.cartArray);
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
