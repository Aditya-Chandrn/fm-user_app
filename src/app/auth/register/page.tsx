import RegisterForm from '@/components/RegisterForm';
import { Suspense } from 'react';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 relative overflow-hidden py-12">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/[0.04] dark:bg-grid-white/[0.04]" />
      <div className="absolute h-full w-full bg-slate-50 dark:bg-zinc-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-zinc-800 backdrop-blur-sm">
         <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
                <UserPlus className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Join our fleet management platform</p>
         </div>
         <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
         </Suspense>
      </div>
    </div>
  );
}

