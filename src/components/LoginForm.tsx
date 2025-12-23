'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginSchema, LoginFormData } from '@/lib/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post('/auth/login', data);
      const { token } = res.data;
      
      const userRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
      });
      
      const user = userRes.data.data;
      login(token, user);
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-md border border-red-200 dark:border-red-900">
                {error}
            </div>
        )}
        
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

        <Button 
            type="submit" 
            isLoading={isSubmitting} 
            className="w-full"
        >
            Sign In
        </Button>
      </form>
      
      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              create account
          </Link>
      </p>
    </div>
  );
}

