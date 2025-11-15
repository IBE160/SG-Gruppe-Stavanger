@echo off
echo Oppdaterer .env.local med korrekte Supabase connection strings...
(
echo DATABASE_URL="postgresql://postgres.bucxoglospkxknbqynhq:ThomasHildeFrida1234!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
echo DIRECT_URL="postgresql://postgres.bucxoglospkxknbqynhq:ThomasHildeFrida1234!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
echo AUTH_SECRET="NkwzuIdgvzt+MBxI4Vl6EKcWFv8uEmfzCpJVn97u7Jo="
echo AUTH_URL="http://localhost:3000"
echo SPOONACULAR_API_KEY="b0b7eb9913b94806966ecd2f1f63422f"
echo NEXT_PUBLIC_SPOONACULAR_API_KEY="b0b7eb9913b94806966ecd2f1f63422f"
echo GOOGLE_AI_API_KEY="AIzaSyBKBh1b5qA84v8R-c3t8J1nUBa4yYdKjl0"
echo NEXT_PUBLIC_GOOGLE_AI_API_KEY="AIzaSyBKBh1b5qA84v8R-c3t8J1nUBa4yYdKjl0"
) > .env.local
echo.
echo Ferdig! .env.local er oppdatert.
echo.
echo Test connection med: node test-connection.js
