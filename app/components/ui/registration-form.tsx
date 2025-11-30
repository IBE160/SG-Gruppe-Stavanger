'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    
    // Password complexity validation
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return false;
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setPasswordError('Password must contain uppercase, lowercase, number, and special character.');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Clear error instantly
    if (emailError) validateEmail(newEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // Clear error instantly
    if (passwordError) validatePassword(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration form submitted'); // Debug log
    
    setError('');
    setLoading(true);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setLoading(false);
      return;
    }

    try {
      console.log('Sending registration request to /api/auth/register'); // Debug log
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Registration response:', response.status, data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      console.log('Registration successful, redirecting to login'); // Debug log
      // Successful registration, redirect to login page
      router.push('/login?registered=true');
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-light-beige shadow-farmhouse-dark">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-charcoal">Register</CardTitle>
        <CardDescription className="text-sage-green">
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-charcoal">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={handleEmailChange}
              className="border-2 border-sage-green focus:border-terracotta"
              disabled={loading}
            />
            {emailError && <p className="text-terracotta text-sm">{emailError}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-charcoal">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={handlePasswordChange}
              className="border-2 border-sage-green focus:border-terracotta"
              disabled={loading}
            />
            {passwordError && <p className="text-terracotta text-sm">{passwordError}</p>}
            <p className="text-terracotta text-xs">
              Password must be at least 8 characters with uppercase, lowercase, number, and special character.
            </p>
          </div>
          {error && <p className="text-terracotta text-sm text-center">{error}</p>}
          <Button 
            type="submit" 
            className="w-full bg-terracotta text-light-beige hover:bg-terracotta/90" 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <p className="text-center text-sm text-charcoal">
            Already have an account?{' '}
            <a href="/login" className="text-terracotta hover:underline font-medium">
              Login
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
