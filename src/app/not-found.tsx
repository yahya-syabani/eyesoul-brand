import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center">
        <div className="heading3 mb-4">Page not found</div>
        <p className="body1 text-secondary mb-6">
          The page you’re looking for doesn’t exist, or it may have been moved.
        </p>
        <Link href="/" className="button-main">
          Go Home
        </Link>
      </div>
    </div>
  )
}


