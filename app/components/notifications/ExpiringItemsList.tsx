'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface FoodItem {
  id: string;
  name: string;
  bestBeforeDate: string;
  category: string;
  quantity: number;
  unit: string;
}

export default function ExpiringItemsList() {
  const [expiringItems, setExpiringItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExpiringItems();
  }, []);

  const fetchExpiringItems = async () => {
    try {
      setIsLoading(true);

      // Calculate date range for items expiring in the next 7 days
      const now = new Date();
      const sevenDaysFromNow = new Date(now);
      sevenDaysFromNow.setDate(now.getDate() + 7);

      // Fetch all inventory items
      const response = await fetch('/api/inventory');
      if (response.ok) {
        const data = await response.json();

        // Filter items expiring within 7 days
        const expiring = data.foodItems.filter((item: FoodItem) => {
          const expirationDate = new Date(item.bestBeforeDate);
          return expirationDate >= now && expirationDate <= sevenDaysFromNow;
        });

        // Sort by expiration date (soonest first)
        expiring.sort((a: FoodItem, b: FoodItem) => {
          return new Date(a.bestBeforeDate).getTime() - new Date(b.bestBeforeDate).getTime();
        });

        setExpiringItems(expiring);
      }
    } catch (error) {
      console.error('Error fetching expiring items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDaysRemaining = (bestBeforeDate: string) => {
    const now = new Date();
    const expirationDate = new Date(bestBeforeDate);
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysRemaining: number) => {
    if (daysRemaining <= 1) {
      return 'text-red-600 bg-red-50 border-red-200';
    } else if (daysRemaining <= 3) {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    } else {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getUrgencyBadge = (daysRemaining: number) => {
    if (daysRemaining <= 1) {
      return <Badge variant="destructive">Urgent</Badge>;
    } else if (daysRemaining <= 3) {
      return <Badge className="bg-orange-500 hover:bg-orange-600">Soon</Badge>;
    } else {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Upcoming</Badge>;
    }
  };

  const formatDaysRemaining = (days: number) => {
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `Expires in ${days} days`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading expiring items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Items Expiring Soon</h1>
        <p className="text-muted-foreground">
          Items expiring within the next 7 days
        </p>
      </div>

      {expiringItems.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h2 className="text-xl font-semibold mb-2">No Items Expiring Soon</h2>
              <p className="text-muted-foreground">
                You don't have any items expiring in the next 7 days.
              </p>
              <Link
                href="/pantry"
                className="inline-block mt-4 text-primary hover:underline"
              >
                View All Items
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Found {expiringItems.length} item{expiringItems.length !== 1 ? 's' : ''} expiring soon
          </div>

          {expiringItems.map((item) => {
            const daysRemaining = calculateDaysRemaining(item.bestBeforeDate);
            return (
              <Card
                key={item.id}
                className={cn('border-l-4', getUrgencyColor(daysRemaining))}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        {getUrgencyBadge(daysRemaining)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Category:</span>{' '}
                          <span className="font-medium">{item.category}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>{' '}
                          <span className="font-medium">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {formatDaysRemaining(daysRemaining)}
                            </span>
                            <span className="text-muted-foreground">
                              ({new Date(item.bestBeforeDate).toLocaleDateString()})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/pantry?highlight=${item.id}`}
                      className="text-sm text-primary hover:underline whitespace-nowrap"
                    >
                      View Details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
