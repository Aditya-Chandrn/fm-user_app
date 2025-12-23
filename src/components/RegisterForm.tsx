'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { registerSchema, RegisterFormData } from '@/lib/schemas';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as any) || 'customer';
  
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post('/auth/register', data);
      
      const loginRes = await api.post('/auth/login', { 
          email: data.email, 
          password: data.password 
      });
      
      const { token } = loginRes.data;
      
      // Fetch user details
      const userRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
      });
      const user = userRes.data.data;
      
      login(token, user);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-md border border-red-200 dark:border-red-900">
                {error}
            </div>
        )}
      
        <Input 
            label="Full Name"
            placeholder="John Doe"
            {...register('name')}
            error={errors.name?.message}
        />

        <Input 
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            error={errors.email?.message}
        />

        <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
        />
        
         <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
            <div className="relative">
                <select 
                    {...register('role')} 
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white transition-all duration-200 appearance-none"
                >
                    <option value="customer">Customer</option>
                    <option value="driver">Driver</option>
                    <option value="owner">Vehicle Owner</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
            </div>
            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
        </div>

        <Button 
            type="submit" 
            isLoading={isSubmitting} 
            className="w-full mt-4"
        >
            Create Account
        </Button>
      </form>
      
      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
          </Link>
      </p>
    </div>
  );
}

