'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddFoodItemForm } from '@/components/pantry/AddFoodItemForm';
import { EditFoodItemForm } from '@/components/pantry/EditFoodItemForm';
import { DeleteConfirmationDialog } from '@/components/pantry/DeleteConfirmationDialog';
import { PantryShelf } from '@/components/pantry/PantryShelf';
import { SortControls, SortField, SortOrder } from '@/components/pantry/SortControls';
import { FoodItem } from '@/components/pantry/IngredientIcon';

export default function PantryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<FoodItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchFoodItems = async (sortField?: SortField, sortDirection?: SortOrder) => {
    try {
      setLoading(true);
      const field = sortField || sortBy;
      const direction = sortDirection || sortOrder;

      const params = new URLSearchParams({
        sortBy: field,
        sortOrder: direction,
      });

      const response = await fetch(`/api/inventory?${params}`);
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
    fetchFoodItems();
  };

  const handleSortChange = (newSortBy: SortField, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    fetchFoodItems(newSortBy, newSortOrder);
  };

  const handleItemSelect = (item: FoodItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = (updatedItem: FoodItem) => {
    // Optimistic UI update
    const previousItems = [...foodItems];

    setFoodItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );

    // Verify the update by refetching from server
    fetchFoodItems().catch(() => {
      // Rollback on error
      setFoodItems(previousItems);
    });
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleItemDelete = (item: FoodItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (itemId: string) => {
    // Store previous items for rollback
    const previousItems = [...foodItems];

    try {
      // Optimistic UI update - set deleting state for fade-out animation
      setDeletingItemId(itemId);

      // Wait for fade-out animation (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));

      // Remove from UI
      setFoodItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );

      // Call API to delete from server
      const response = await fetch(`/api/inventory/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete food item');
      }

      // Clear deleting state
      setDeletingItemId(null);
    } catch (error) {
      // Rollback on error
      setFoodItems(previousItems);
      setDeletingItemId(null);
      throw error;
    }
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-beige">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-green" />
          <p className="text-charcoal">Loading your pantry...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light-beige p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">My Pantry</h1>
            <p className="text-sm text-charcoal/70 mt-1">
              Manage your food inventory and reduce waste
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <AddFoodItemForm onSuccess={handleAddSuccess} />
            <Button
              onClick={() => signOut({ callbackUrl: '/login' })}
              variant="outline"
              className="text-charcoal border-charcoal/20 hover:bg-charcoal/5"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white shadow-farmhouse border-sage-green/20">
          <CardHeader className="border-b border-sage-green/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl text-charcoal">Open Shelves</CardTitle>
                <CardDescription className="text-sage-green mt-1">
                  {foodItems.length} {foodItems.length === 1 ? 'item' : 'items'} in your inventory
                </CardDescription>
              </div>
              {foodItems.length > 0 && (
                <SortControls
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <PantryShelf
              foodItems={foodItems}
              onItemSelect={handleItemSelect}
              onItemDelete={handleItemDelete}
              deletingItemId={deletingItemId}
            />
          </CardContent>
        </Card>

        {/* Edit Food Item Dialog */}
        {editingItem && (
          <EditFoodItemForm
            item={editingItem}
            open={isEditDialogOpen}
            onClose={handleEditClose}
            onSuccess={handleEditSuccess}
          />
        )}

        {/* Delete Confirmation Dialog */}
        {deletingItem && (
          <DeleteConfirmationDialog
            item={deletingItem}
            isOpen={isDeleteDialogOpen}
            onClose={handleDeleteClose}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </div>
    </div>
  );
}
