'use client';

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import NotificationPanel from './NotificationPanel';

interface NotificationBadgeProps {
  className?: string;
}

export default function NotificationBadge({ className }: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/expiring');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Poll for new notifications every 5 minutes
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationDismissed = () => {
    // Refresh count after dismissing a notification
    fetchUnreadCount();
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className="relative"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <NotificationPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onNotificationDismissed={handleNotificationDismissed}
        />
      )}
    </div>
  );
}
