'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import ToastContainer from '@/components/Toast/ToastContainer'
import type CountdownTimeType from '@/type/CountdownType'

const ModalCart = dynamic(() => import('@/components/Modal/ModalCart'), { ssr: false })
const ModalWishlist = dynamic(() => import('@/components/Modal/ModalWishlist'), { ssr: false })
const ModalSearch = dynamic(() => import('@/components/Modal/ModalSearch'), { ssr: false })
const ModalQuickview = dynamic(() => import('@/components/Modal/ModalQuickview'), { ssr: false })
const ModalCompare = dynamic(() => import('@/components/Modal/ModalCompare'), { ssr: false })
const ModalNewsletter = dynamic(() => import('@/components/Modal/ModalNewsletter'), { ssr: false })

type Props = {
  children: React.ReactNode
  serverTimeLeft: CountdownTimeType
}

export default function ClientShell({ children, serverTimeLeft }: Props) {
  return (
    <>
      {children}
      <ToastContainer />
      <ModalCart serverTimeLeft={serverTimeLeft} />
      <ModalWishlist />
      <ModalSearch />
      <ModalQuickview />
      <ModalCompare />
      <ModalNewsletter />
    </>
  )
}


