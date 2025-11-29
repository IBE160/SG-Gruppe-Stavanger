'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import logger from '@/lib/logger';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Email validation regex (basic)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Password complexity regex: at least 8 characters, one uppercase, one lowercase, one number, one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required.');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required.');
      return false;
    }
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return; // Prevent form submission if client-side validation fails
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
      } else {
        setSuccess(data.message || 'Registration successful! Attempting to log in...');
        // Attempt to sign in the user directly after successful registration
        const result = await signIn('credentials', {
          redirect: false, // Do not redirect immediately
          email,
          password,
        });

        if (result?.error) {
          setError('Registration successful, but automatic login failed: ' + result.error);
        } else {
          router.push('/dashboard'); // Redirect to dashboard or home page after successful login
        }
      }
    } catch (err) {
      logger.error('Client-side registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 farmhouse-kitchen-bg"> {/* Added a placeholder class for aesthetic */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Placeholder for farmhouse-kitchen-bg style - to be defined in globals.css or similar
// .farmhouse-kitchen-bg {
//   background-color: #f5f5dc; // Example: a subtle beige
//   background-image: url('/images/farmhouse-pattern.png'); // Example: a subtle pattern
//   background-size: cover;
//   background-position: center;
// }
