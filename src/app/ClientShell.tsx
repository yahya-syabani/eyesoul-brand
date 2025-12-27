'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import ToastContainer from '@/components/Toast/ToastContainer'
import type CountdownTimeType from '@/type/CountdownType'
import Header from '@/components/Header/Header'

const ModalCart = dynamic(() => import('@/components/Modal/ModalCart'), { ssr: false })
const ModalWishlist = dynamic(() => import('@/components/Modal/ModalWishlist'), { ssr: false })
const ModalSearch = dynamic(() => import('@/components/Modal/ModalSearch'), { ssr: false })
const ModalQuickview = dynamic(() => import('@/components/Modal/ModalQuickview'), { ssr: false })
const ModalCompare = dynamic(() => import('@/components/Modal/ModalCompare'), { ssr: false })
const ModalNewsletter = dynamic(() => import('@/components/Modal/ModalNewsletter'), { ssr: false })
const ModalStoreLocation = dynamic(() => import('@/components/Modal/ModalStoreLocation'), { ssr: false })

type Props = {
  children: React.ReactNode
  serverTimeLeft: CountdownTimeType
}

export default function ClientShell({ children, serverTimeLeft }: Props) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdminPage && <Header topNavProps="style-two bg-purple" slogan='Limited Offer: Free shipping on orders over $50' />}
      {children}
      <ToastContainer />
      {!isAdminPage && (
        <>
          <ModalCart serverTimeLeft={serverTimeLeft} />
          <ModalWishlist />
          <ModalSearch />
          <ModalQuickview />
          <ModalCompare />
          <ModalNewsletter />
          <ModalStoreLocation />
        </>
      )}
    </>
  )
}


