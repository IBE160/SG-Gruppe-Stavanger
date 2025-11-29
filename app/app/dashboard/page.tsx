'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-beige">
        <p className="text-charcoal">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light-beige p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-charcoal">Dashboard</h1>
          <Button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-terracotta text-white hover:bg-terracotta/90"
          >
            Sign Out
          </Button>
        </div>

        <Card className="bg-white shadow-farmhouse">
          <CardHeader>
            <CardTitle className="text-charcoal">Welcome back!</CardTitle>
            <CardDescription className="text-sage-green">
              You are now logged in to your Smart Food & Recipe Platform account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-charcoal">Email:</p>
                <p className="text-sage-green">{session.user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal">User ID:</p>
                <p className="text-sage-green">{session.user?.id}</p>
              </div>
              <div className="mt-6 rounded-lg bg-light-beige p-4">
                <p className="text-charcoal">
                  This is your dashboard. Future features like pantry management, recipe recommendations, and inventory tracking will appear here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
