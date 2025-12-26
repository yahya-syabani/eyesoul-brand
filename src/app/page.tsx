import { redirect } from 'next/navigation';

// Root page - redirect to default locale
// This ensures "/" always redirects to "/en" even if middleware doesn't catch it
export default function RootPage() {
  redirect('/en');
}
