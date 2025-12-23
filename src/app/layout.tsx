import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fleet Management System',
  description: 'Manage your fleet efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
