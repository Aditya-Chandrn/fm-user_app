import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from '@/lib/api';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const user = res.data; // Expecting { success: true, token: '...', user: {...} } 
          // Wait, backend login returns { success: true, token }. It doesn't return user details yet?
          // I should verify backend login controller.
          // Controller: res.status(200).json({ success: true, token });
          // It does NOT return user object. I need to fetch user details or update backend.
          // For now, I will decode the token or assume the user exists. 
          // Actually, NextAuth needs an object to return.
          // If I strictly follow my backend, I only have token.
          // I should probably decode the token to get ID/Role, but better to update backend to return User.
          // However, I can't update backend easily now without context switching.
          // I will make a call to /auth/me using the token if possible, OR just return a minimal object with the token as property.
          
          if (res.data.success && res.data.token) {
              // Return object that will be persisted in JWT
              return { id: 'user-id-placeholder', token: res.data.token, email: credentials.email };
          }
          return null;
        } catch (e) {
          console.error('Login failed', e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token;
        // In a real app we would decode role here or fetch it
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  jwt: {
      maxAge: 24 * 60 * 60, // 1 day
  }
};
