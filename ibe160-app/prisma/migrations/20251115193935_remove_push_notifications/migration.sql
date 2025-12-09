-- Remove push notification fields from user_preferences table
ALTER TABLE "user_preferences" DROP COLUMN IF EXISTS "pushNotifications";
ALTER TABLE "user_preferences" DROP COLUMN IF EXISTS "pushSubscription";
