'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, History, User, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { clsx } from 'clsx';

const Sidebar = () => {
    const { logout } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: History, label: 'My Trips', path: '/dashboard/trips', roles: ['customer'] }, // Removed 'driver'
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
    ];

    const { user } = useAuth(); // Need user to check role
    const filteredNavItems = navItems.filter(item => !item.roles || (user && item.roles.includes(user.role)));

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold text-blue-400">FMS User</h1>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
                {filteredNavItems.map((item) => (
                    <Link 
                        key={item.path} 
                        href={item.path}
                        className={clsx(
                            "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                            pathname === item.path 
                                ? "bg-blue-600 text-white" 
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700 space-y-4">
                <button  
                    onClick={logout}
                    className="flex items-center space-x-3 p-3 text-red-400 hover:bg-slate-800 w-full rounded-lg transition"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
