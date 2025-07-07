'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase/client';
import { formatDate, formatTime } from '@/lib/utils';

interface BookingFormProps {
  doctorId: string;
  availability: Record<string, string[]> | null;
}

export default function BookingForm({ doctorId, availability }: BookingFormProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    
    checkUser();
  }, []);

  // Update available times when date changes
  useEffect(() => {
    if (date && availability) {
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
      const times = availability[dayOfWeek] || [];
      setAvailableTimes(times);
      setTime(''); // Reset time when date changes
    } else {
      setAvailableTimes([]);
    }
  }, [date, availability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Check if user is logged in
    if (!user) {
      router.push('/auth/login?redirect=/public/booking?doctor=' + doctorId);
      return;
    }

    if (!date || !time) {
      setError('Please select both date and time');
      return;
    }

    setIsLoading(true);

    try {
      // Create appointment
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert([
          {
            user_id: user.id,
            doctor_id: doctorId,
            date,
            time,
            notes: notes || null,
            status: 'pending',
          },
        ]);

      if (appointmentError) {
        throw appointmentError;
      }

      setSuccess(true);
      setDate('');
      setTime('');
      setNotes('');
    } catch (error: any) {
      setError(error.message || 'An error occurred while booking the appointment');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate min date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  // Calculate max date (3 months from now)
  const maxDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
          <h3 className="font-semibold text-lg mb-2">Appointment Booked Successfully!</h3>
          <p>Your appointment has been scheduled. You can view your appointments in your dashboard.</p>
          <div className="mt-4">
            <Button 
              type="button" 
              onClick={() => router.push('/auth/dashboard')}
              variant="outline"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}
      
      {!success && (
        <div className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              max={maxDate}
              required
              disabled={isLoading}
            />
          </div>
          
          {date && (
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Select Time
              </label>
              {availableTimes.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((timeSlot) => (
                    <button
                      key={timeSlot}
                      type="button"
                      className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        time === timeSlot
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => setTime(timeSlot)}
                      disabled={isLoading}
                    >
                      {formatTime(timeSlot)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm py-2">No available times for this date. Please select another date.</p>
              )}
            </div>
          )}
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific concerns or information for the doctor"
              disabled={isLoading}
            />
          </div>
          
          {date && time && (
            <Card variant="outline" className="bg-gray-50">
              <CardContent className="py-4">
                <h3 className="font-medium mb-2">Appointment Summary</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{formatTime(time)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoading}
            disabled={!date || !time || isLoading}
          >
            {user ? 'Book Appointment' : 'Sign In to Book'}
          </Button>
        </div>
      )}
    </form>
  );
}