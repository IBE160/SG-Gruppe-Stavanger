'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddFoodItemForm } from '@/components/pantry/AddFoodItemForm';

type FoodItem = {
  id: string;
  name: string;
  category: string;
  bestBeforeDate: string;
  quantity: number;
  unit: string;
  createdAt: string;
};

export default function PantryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory');
      if (response.ok) {
        const data = await response.json();
        setFoodItems(data.foodItems || []);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchFoodItems();
    }
  }, [session]);

  const handleAddSuccess = () => {
    // Refresh the food items list
    fetchFoodItems();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (status === 'loading' || loading) {
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
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-charcoal">My Pantry</h1>
          <div className="flex gap-4">
            <AddFoodItemForm onSuccess={handleAddSuccess} />
            <Button
              onClick={() => signOut({ callbackUrl: '/login' })}
              variant="outline"
              className="text-charcoal"
            >
              Sign Out
            </Button>
          </div>
        </div>

        <Card className="bg-white shadow-farmhouse">
          <CardHeader>
            <CardTitle className="text-charcoal">Open Shelves</CardTitle>
            <CardDescription className="text-sage-green">
              View and manage your food inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {foodItems.length === 0 ? (
              <div className="rounded-lg bg-light-beige p-8 text-center">
                <p className="text-charcoal">
                  Your pantry is empty. Click "Add Item" to start tracking your food inventory.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {foodItems.map((item) => (
                  <Card key={item.id} className="border-sage-green/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-charcoal">
                        {item.name}
                      </CardTitle>
                      <CardDescription className="text-sage-green">
                        {item.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal/70">Quantity:</span>
                        <span className="font-medium text-charcoal">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal/70">Best Before:</span>
                        <span className="font-medium text-charcoal">
                          {formatDate(item.bestBeforeDate)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal/70">Added:</span>
                        <span className="font-medium text-charcoal">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
