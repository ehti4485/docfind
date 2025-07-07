import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import DashboardHeader from '@/components/layout/DashboardHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatTime } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Appointments - DocFind',
  description: 'View and manage your doctor appointments',
};

export default async function AppointmentsPage() {
  const supabase = createClient();
  
  // Get user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user appointments with doctor information
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctors:doctor_id(*)
    `)
    .eq('user_id', user?.id)
    .order('appointment_date', { ascending: true });
  
  // Group appointments by status
  const upcomingAppointments = appointments?.filter(app => {
    const appointmentDate = new Date(`${app.appointment_date}T${app.appointment_time}`);
    return appointmentDate > new Date() && app.status !== 'cancelled';
  }) || [];
  
  const pastAppointments = appointments?.filter(app => {
    const appointmentDate = new Date(`${app.appointment_date}T${app.appointment_time}`);
    return appointmentDate <= new Date() || app.status === 'cancelled';
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">My Appointments</h1>
              <Link href="/public/doctors">
                <Button>Book New Appointment</Button>
              </Link>
            </div>
            
            <div className="space-y-8">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length === 0 ? (
                    <p className="text-gray-500">You don't have any upcoming appointments.</p>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="font-medium">Dr. {appointment.doctors.name}</h3>
                            <p className="text-sm text-gray-500">{appointment.doctors.specialty}</p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex space-x-3">
                            <Link href={`/auth/dashboard/appointments/${appointment.id}`}>
                              <Button variant="outline" size="sm">View Details</Button>
                            </Link>
                            <CancelAppointmentButton appointmentId={appointment.id} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Past Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Past Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {pastAppointments.length === 0 ? (
                    <p className="text-gray-500">You don't have any past appointments.</p>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {pastAppointments.map((appointment) => (
                        <div key={appointment.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="font-medium">Dr. {appointment.doctors.name}</h3>
                            <p className="text-sm text-gray-500">{appointment.doctors.specialty}</p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
                            </div>
                            <div className="mt-1 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {appointment.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0">
                            <Link href={`/auth/dashboard/appointments/${appointment.id}`}>
                              <Button variant="outline" size="sm">View Details</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
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

// Client component for cancelling appointments
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

function CancelAppointmentButton({ appointmentId }: { appointmentId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);
        
      if (error) throw error;
      
      router.refresh();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleCancel} 
      isLoading={isLoading}
      className="text-red-600 border-red-200 hover:bg-red-50"
    >
      Cancel
    </Button>
  );
}