import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DashboardHeader from '@/components/layout/DashboardHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatTime } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Dashboard - DocFind',
  description: 'Manage your appointments and doctor bookings',
};

export default async function DashboardPage() {
  const supabase = createClient();
  
  // Get user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id)
    .single();
  
  // Get upcoming appointments
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      *,
      doctors:doctor_id (name, specialty, image_url)
    `)
    .eq('user_id', user?.id)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .order('time', { ascending: true })
    .limit(5);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            {/* Welcome Card */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-2">
                  Welcome back, {profile?.full_name || 'User'}!
                </h2>
                <p className="text-gray-600">
                  Manage your appointments and health information from your personal dashboard.
                </p>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointments && appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{appointment.doctors?.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : appointment.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{appointment.doctors?.specialty}</p>
                          <div className="flex space-x-4 text-sm">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{formatTime(appointment.time)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Link href="/auth/dashboard/appointments">
                        <Button variant="outline" className="w-full mt-2">
                          View All Appointments
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-600 mb-4">You don't have any upcoming appointments.</p>
                      <Link href="/public/doctors">
                        <Button>
                          Book an Appointment
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Profile Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile ? (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 rounded-full p-3 mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">{profile.full_name}</h3>
                          <p className="text-sm text-gray-600">{profile.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {profile.phone && (
                          <div className="flex">
                            <span className="text-gray-600 w-24">Phone:</span>
                            <span>{profile.phone}</span>
                          </div>
                        )}
                        
                        {profile.address && (
                          <div className="flex">
                            <span className="text-gray-600 w-24">Address:</span>
                            <span>{profile.address}</span>
                          </div>
                        )}
                      </div>
                      
                      <Link href="/auth/profile">
                        <Button variant="outline" className="w-full mt-2">
                          Edit Profile
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-600 mb-4">Your profile information is incomplete.</p>
                      <Link href="/auth/profile">
                        <Button>
                          Complete Your Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}