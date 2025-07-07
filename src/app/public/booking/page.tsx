import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookingForm from '@/components/forms/BookingForm';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Book Appointment - DocFind',
  description: 'Book an appointment with your preferred doctor',
};

interface BookingPageProps {
  searchParams: {
    doctor?: string;
  };
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const doctorId = searchParams.doctor;
  
  // Redirect if no doctor ID is provided
  if (!doctorId) {
    redirect('/public/doctors');
  }
  
  const supabase = createClient();
  
  // Fetch doctor details
  const { data: doctor, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', doctorId)
    .single();
  
  // Redirect if doctor not found
  if (error || !doctor) {
    redirect('/public/doctors');
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{doctor.name}</h2>
                  <p className="text-gray-600">{doctor.specialty}</p>
                </div>
              </div>
              
              <BookingForm doctorId={doctorId} availability={doctor.availability} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}