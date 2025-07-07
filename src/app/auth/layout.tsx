import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  
  // Get session
  const { data: { session } } = await supabase.auth.getSession();
  
  // If no session and not on login or register page, redirect to login
  const pathname = new URL(new Request('http://localhost').url).pathname;
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register';
  
  if (!session && !isAuthPage) {
    redirect('/auth/login');
  }
  
  // If session and on login or register page, redirect to dashboard
  if (session && isAuthPage) {
    redirect('/auth/dashboard');
  }
  
  return (
    <div>
      {children}
    </div>
  );
}