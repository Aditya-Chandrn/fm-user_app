'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CustomerDashboard from '@/components/dashboard/CustomerDashboard';
import OwnerDashboard from '@/components/dashboard/OwnerDashboard';
import DriverDashboard from '@/components/dashboard/DriverDashboard';

export default function DashboardPage() {
    const { user, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/auth/login');
        }
    }, [token, router]);

    if (!user) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Welcome back, {user.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {user.email} • <span className="capitalize font-medium text-blue-600">{user.role}</span>
                </p>
            </header>

            <main>
                {user.role === 'customer' && <CustomerDashboard />}
                {user.role === 'owner' && <OwnerDashboard />}
                {user.role === 'driver' && <DriverDashboard />}
                {user.role === 'admin' && (
                    <div className="p-8 bg-yellow-50 text-yellow-800 rounded-lg">
                        <p>Admins should use the Admin Portal for comprehensive management.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
