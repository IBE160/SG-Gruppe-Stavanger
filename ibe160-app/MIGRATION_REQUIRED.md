# Database Migration Required

## Push Notification Fields Removed

The following fields have been removed from the database schema since push notifications are no longer used in the application:

- `UserPreference.pushNotifications` (Boolean)
- `UserPreference.pushSubscription` (String)

## How to Apply the Migration

Run the following command to apply the database migration:

```bash
npx prisma migrate deploy
```

Or if you're in development:

```bash
npx prisma migrate dev
```

This will remove the unused columns from the `user_preferences` table in your database.

## What's Changed

### Files Updated:
1. `prisma/schema.prisma` - Removed pushNotifications and pushSubscription fields
2. `src/app/api/preferences/route.ts` - Removed push notification handling
3. `src/app/api/cron/expiration-alerts/route.ts` - Removed push notification sending
4. `src/app/(auth)/preferences/page.tsx` - Already updated (email-only notifications)

### Migration File:
- `prisma/migrations/20251115193935_remove_push_notifications/migration.sql`

## After Migration

After running the migration, regenerate the Prisma client:

```bash
npx prisma generate
```

Then restart your development server.
