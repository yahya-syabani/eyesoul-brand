import AdminLayout from '@/components/Admin/AdminLayout'
import { ThemeProvider } from '@/context/ThemeContext'

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AdminLayout>{children}</AdminLayout>
    </ThemeProvider>
  )
}

