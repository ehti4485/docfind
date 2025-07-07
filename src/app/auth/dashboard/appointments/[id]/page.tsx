import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DashboardHeader from '@/components/layout/DashboardHeader';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatTime } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Appointment Details - DocFind',
  description: 'View your doctor appointment details',
};

export default async function AppointmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  
  // Get user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get appointment with doctor information
  const { data: appointment, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctors:doctor_id(*)
    `)
    .eq('id', params.id)
    .eq('user_id', user?.id)
    .single();
  
  if (error || !appointment) {
    notFound();
  }

  // Check if appointment is upcoming
  const appointmentDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
  const isUpcoming = appointmentDate > new Date() && appointment.status !== 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Appointment Details</h1>
              <Link href="/auth/dashboard/appointments">
                <Button variant="outline">Back to Appointments</Button>
              </Link>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Appointment with Dr. {appointment.doctors.name}</CardTitle>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : isUpcoming ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {appointment.status === 'cancelled' ? 'Cancelled' : isUpcoming ? 'Upcoming' : 'Completed'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Doctor Information</h3>
                      <div className="mt-2 space-y-2">
                        <p className="text-gray-900">Dr. {appointment.doctors.name}</p>
                        <p className="text-gray-600">{appointment.doctors.specialty}</p>
                        {appointment.doctors.phone && (
                          <p className="text-gray-600">
                            <span className="font-medium">Phone:</span> {appointment.doctors.phone}
                          </p>
                        )}
                        {appointment.doctors.email && (
                          <p className="text-gray-600">
                            <span className="font-medium">Email:</span> {appointment.doctors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Appointment Details</h3>
                      <div className="mt-2 space-y-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Date:</span> {formatDate(appointment.appointment_date)}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Time:</span> {formatTime(appointment.appointment_time)}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Booked on:</span> {new Date(appointment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                      <p className="mt-2 text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                  
                  {isUpcoming && (
                    <div className="pt-4 border-t border-gray-200">
                      <CancelAppointmentButton appointmentId={appointment.id} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
      onClick={handleCancel} 
      isLoading={isLoading}
      className="text-red-600 border-red-200 hover:bg-red-50"
    >
      Cancel Appointment
    </Button>
  );
}