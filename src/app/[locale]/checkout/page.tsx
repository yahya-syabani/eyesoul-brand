import React, { Suspense } from 'react'
import CheckoutContent from './CheckoutContent'
import PageLoader from '@/components/Loading/PageLoader'

const Checkout = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <CheckoutContent />
        </Suspense>
    )
}

export default Checkout
