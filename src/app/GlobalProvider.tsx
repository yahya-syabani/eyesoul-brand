import React from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/context/ToastContext'
import { CartProvider } from '@/context/CartContext'
import { ModalCartProvider } from '@/context/ModalCartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { ModalWishlistProvider } from '@/context/ModalWishlistContext'
import { CompareProvider } from '@/context/CompareContext'
import { ModalCompareProvider } from '@/context/ModalCompareContext'
import { ModalSearchProvider } from '@/context/ModalSearchContext'
import { ModalQuickviewProvider } from '@/context/ModalQuickviewContext'
import { ModalStoreLocationProvider } from '@/context/ModalStoreLocationContext'
import { ModalPromotionProvider } from '@/context/ModalPromotionContext'

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const providers = [
        ThemeProvider,
        ToastProvider,
        CartProvider,
        ModalCartProvider,
        WishlistProvider,
        ModalWishlistProvider,
        CompareProvider,
        ModalCompareProvider,
        ModalSearchProvider,
        ModalQuickviewProvider,
        ModalStoreLocationProvider,
        ModalPromotionProvider,
    ] as const

    return providers.reduceRight<React.ReactNode>((acc, Provider) => <Provider>{acc}</Provider>, children)
}

export default GlobalProvider