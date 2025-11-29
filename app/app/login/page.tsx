// app/login/page.tsx
import { Metadata } from 'next';
import { LoginForm } from '@/components/ui/login-form';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your Smart Food & Recipe Platform account.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-light-beige p-8 shadow-farmhouse">
        <h1 className="text-center text-3xl font-bold text-charcoal">Welcome Back!</h1>
        <LoginForm />
        <p className="text-center text-charcoal">
          Don't have an account?{' '}
          <Link href="/register" className="text-terracotta hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
