/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { PUT, DELETE } from '../route';
import { prisma } from '@/prisma-client';
import { getServerSession } from 'next-auth';

// Mock dependencies
jest.mock('@/prisma-client', () => ({
  prisma: {
    foodItem: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/logger');

jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}));

describe('PUT /api/inventory/[id]', () => {
  const mockUserId = 'user-123';
  const mockItemId = 'item-456';
  const mockSession = {
    user: {
      id: mockUserId,
      email: 'test@example.com',
    },
  };

  const mockExistingItem = {
    id: mockItemId,
    name: 'Old Tomatoes',
    category: 'Vegetables',
    bestBeforeDate: new Date('2025-12-31'),
    quantity: 2,
    unit: 'kg',
    userId: mockUserId,
    createdAt: new Date('2025-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update a food item with valid data', async () => {
    const updatedData = {
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      bestBeforeDate: '2026-01-15T00:00:00.000Z',
      quantity: 3,
      unit: 'kg',
    };

    const mockUpdatedItem = {
      ...mockExistingItem,
      ...updatedData,
      bestBeforeDate: new Date(updatedData.bestBeforeDate),
    };

    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockExistingItem);
    (prisma.foodItem.update as jest.Mock).mockResolvedValue(mockUpdatedItem);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });

    const response = await PUT(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Food item updated successfully');
    expect(data.foodItem.name).toBe('Fresh Tomatoes');
    expect(data.foodItem.quantity).toBe(3);
    expect(prisma.foodItem.update).toHaveBeenCalledWith({
      where: { id: mockItemId },
      data: {
        ...updatedData,
        bestBeforeDate: new Date(updatedData.bestBeforeDate),
      },
    });
  });

  it('should successfully update only specific fields', async () => {
    const partialUpdate = {
      quantity: 5,
    };

    const mockUpdatedItem = {
      ...mockExistingItem,
      quantity: 5,
    };

    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockExistingItem);
    (prisma.foodItem.update as jest.Mock).mockResolvedValue(mockUpdatedItem);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'PUT',
      body: JSON.stringify(partialUpdate),
    });

    const response = await PUT(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.foodItem.quantity).toBe(5);
    expect(prisma.foodItem.update).toHaveBeenCalledWith({
      where: { id: mockItemId },
      data: partialUpdate,
    });
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PUT(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
    expect(prisma.foodItem.findUnique).not.toHaveBeenCalled();
  });

  it('should return 404 if food item does not exist', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/inventory/nonexistent', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PUT(request, { params: { id: 'nonexistent' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Food item not found');
    expect(prisma.foodItem.update).not.toHaveBeenCalled();
  });

  it('should return 403 if user tries to edit another user\'s food item', async () => {
    const otherUsersItem = {
      ...mockExistingItem,
      userId: 'different-user-789',
    };

    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(otherUsersItem);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Hacked Name' }),
    });

    const response = await PUT(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Access denied');
    expect(prisma.foodItem.update).not.toHaveBeenCalled();
  });

  it('should return 400 for validation errors - empty name', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockExistingItem);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'PUT',
      body: JSON.stringify({ name: '' }),
    });

    const response = await PUT(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(prisma.foodItem.update).not.toHaveBeenCalled();
  });

  it('should return 400 for validation errors - negative quantity', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockExistingItem);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'PUT',
      body: JSON.stringify({ quantity: -5 }),
    });

    const response = await PUT(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toBeDefined();
    expect(prisma.foodItem.update).not.toHaveBeenCalled();
  });

  it('should return 400 for validation errors - invalid date format', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockExistingItem);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'PUT',
      body: JSON.stringify({ bestBeforeDate: 'invalid-date' }),
    });

    const response = await PUT(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(prisma.foodItem.update).not.toHaveBeenCalled();
  });

  it('should return 400 if no fields are provided for update', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockExistingItem);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'PUT',
      body: JSON.stringify({}),
    });

    const response = await PUT(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(prisma.foodItem.update).not.toHaveBeenCalled();
  });

  it('should return 500 on database error', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockExistingItem);
    (prisma.foodItem.update as jest.Mock).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PUT(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  it('should validate all fields when updating all fields', async () => {
    const fullUpdate = {
      name: 'a'.repeat(101), // Too long
      category: 'Valid Category',
      bestBeforeDate: '2026-01-15T00:00:00.000Z',
      quantity: 3,
      unit: 'kg',
    };

    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockExistingItem);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'PUT',
      body: JSON.stringify(fullUpdate),
    });

    const response = await PUT(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(prisma.foodItem.update).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/inventory/[id]', () => {
  const mockUserId = 'user-123';
  const mockItemId = 'item-456';
  const mockSession = {
    user: {
      id: mockUserId,
      email: 'test@example.com',
    },
  };

  const mockExistingItem = {
    id: mockItemId,
    name: 'Tomatoes',
    category: 'Vegetables',
    bestBeforeDate: new Date('2025-12-31'),
    quantity: 2,
    unit: 'kg',
    userId: mockUserId,
    createdAt: new Date('2025-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully delete a food item', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockExistingItem);
    (prisma.foodItem.delete as jest.Mock).mockResolvedValue(mockExistingItem);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Food item deleted successfully');
    expect(data.foodItemId).toBe(mockItemId);
    expect(prisma.foodItem.delete).toHaveBeenCalledWith({
      where: { id: mockItemId },
    });
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
    expect(prisma.foodItem.findUnique).not.toHaveBeenCalled();
    expect(prisma.foodItem.delete).not.toHaveBeenCalled();
  });

  it('should return 404 if food item does not exist', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/inventory/nonexistent', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: 'nonexistent' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Food item not found');
    expect(prisma.foodItem.delete).not.toHaveBeenCalled();
  });

  it('should return 403 if user tries to delete another user\'s food item', async () => {
    const otherUsersItem = {
      ...mockExistingItem,
      userId: 'different-user-789',
    };

    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(otherUsersItem);

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Access denied');
    expect(prisma.foodItem.delete).not.toHaveBeenCalled();
  });

  it('should return 500 on database error', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.foodItem.findUnique as jest.Mock).mockResolvedValue(mockExistingItem);
    (prisma.foodItem.delete as jest.Mock).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/inventory/item-456', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: mockItemId } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
