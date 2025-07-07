'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';

interface ProfileFormProps {
  initialData?: {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
  } | null;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialData?.full_name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: fullName,
          email,
          phone: phone || null,
          address: address || null,
        }, {
          onConflict: 'user_id',
        });

      if (updateError) {
        throw updateError;
      }

      // Update auth metadata
      await supabase.auth.updateUser({
        data: {
          full_name: fullName,
        },
      });

      setSuccess(true);
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md">
          Your profile has been updated successfully.
        </div>
      )}
      
      <Input
        id="fullName"
        label="Full Name"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        disabled={isLoading}
      />
      
      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />
      
      <Input
        id="phone"
        label="Phone Number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={isLoading}
      />
      
      <Input
        id="address"
        label="Address"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        disabled={isLoading}
      />
      
      <Button 
        type="submit" 
        className="w-full" 
        isLoading={isLoading}
      >
        Save Changes
      </Button>
    </form>
  );
}