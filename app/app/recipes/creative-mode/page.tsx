'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreativeModeForm } from '@/components/recipes/CreativeModeForm';
import { CreativeModeResults, CreativeModeRecipe } from '@/components/recipes/CreativeModeResults';
import { Lightbulb, ArrowLeft } from 'lucide-react';

export default function CreativeModePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [results, setResults] = useState<CreativeModeRecipe[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Handle results from form
  const handleResults = (newResults: CreativeModeRecipe[]) => {
    setResults(newResults);

    // Scroll to results if there are any
    if (newResults.length > 0) {
      setTimeout(() => {
        document.getElementById('creative-mode-results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-beige">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-green" />
          <p className="text-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light-beige p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-sage-green" aria-hidden="true" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">Creative Mode</h1>
              <p className="text-sm text-charcoal/70 mt-1">
                Explore recipe possibilities with your chosen ingredients
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={() => router.push('/recipes')}
              variant="outline"
              className="text-charcoal border-charcoal/20 hover:bg-charcoal/5"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
            <Button
              onClick={() => signOut({ callbackUrl: '/login' })}
              variant="outline"
              className="text-charcoal border-charcoal/20 hover:bg-charcoal/5"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="bg-white rounded-lg shadow-farmhouse border-2 border-sage-green/20 p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-2">
            How It Works
          </h2>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            Creative Mode lets you manually enter ingredients you want to use and discover
            recipes that match them. Perfect for when you have specific items in mind or
            want to experiment with new flavor combinations. Just enter at least 2 ingredients
            and we'll find recipes that make the most of what you have!
          </p>
        </div>

        {/* Creative Mode Form */}
        <CreativeModeForm onResults={handleResults} />

        {/* Results Section */}
        <div id="creative-mode-results">
          <CreativeModeResults results={results} />
        </div>
      </div>
    </div>
  );
}
