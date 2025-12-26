import type { Metadata } from 'next'
import '@/styles/styles.scss'

export const metadata: Metadata = {
  title: 'Eyesoul Eyewear',
  description: 'Multipurpose eCommerce Template',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
