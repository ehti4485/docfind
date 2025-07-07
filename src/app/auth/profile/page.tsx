import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import DashboardHeader from '@/components/layout/DashboardHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import ProfileForm from '@/components/forms/ProfileForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Profile - DocFind',
  description: 'Manage your personal profile information',
};

export default async function ProfilePage() {
  const supabase = createClient();
  
  // Get user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id)
    .single();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm initialData={profile} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}