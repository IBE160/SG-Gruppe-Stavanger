'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming shadcn/ui Checkbox component

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
    // For login, we primarily check for presence. Complexity checked at registration.
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Clear error instantly, validate on submit for less intrusive UX
    if (emailError) validateEmail(newEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // Clear error instantly, validate on submit for less intrusive UX
    if (passwordError) validatePassword(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false, // Prevent NextAuth.js from redirecting immediately
        email,
        password,
        rememberMe: rememberMe.toString(), // Convert boolean to string for NextAuth
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Successful login, redirect to dashboard or pantry view
        router.push('/dashboard'); // Or '/pantry' as per story AC
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-light-beige shadow-farmhouse-dark">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-charcoal">Login</CardTitle>
        <CardDescription className="text-sage-green">
          Enter your credentials to access your account
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
            />
            {passwordError && <p className="text-terracotta text-sm">{passwordError}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="border-sage-green data-[state=checked]:bg-terracotta data-[state=checked]:text-light-beige"
            />
            <Label htmlFor="rememberMe" className="text-charcoal">Remember me</Label>
          </div>
          {error && <p className="text-terracotta text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full bg-terracotta text-light-beige hover:bg-terracotta/90" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

