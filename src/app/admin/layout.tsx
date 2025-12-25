import AdminLayout from '@/components/Admin/AdminLayout'

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}

