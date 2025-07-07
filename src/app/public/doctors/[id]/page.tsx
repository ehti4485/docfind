import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/server';

interface DoctorPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: doctor } = await supabase
    .from('doctors')
    .select('name')
    .eq('id', params.id)
    .single();

  return {
    title: doctor ? `Dr. ${doctor.name} - DocFind` : 'Doctor Profile',
    description: doctor ? `Book an appointment with Dr. ${doctor.name}` : 'Doctor profile and appointment booking',
  };
}

export default async function DoctorPage({ params }: DoctorPageProps) {
  const supabase = createClient();
  
  // Fetch doctor details
  const { data: doctor, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', params.id)
    .single();
  
  if (error || !doctor) {
    notFound();
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Doctor Header */}
              <div className="bg-indigo-600 text-white p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
                <div className="relative h-40 w-40 rounded-full overflow-hidden bg-indigo-300 flex-shrink-0">
                  {doctor.image_url ? (
                    <Image 
                      src={doctor.image_url} 
                      alt={doctor.name} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
                  <p className="text-xl text-indigo-200 mb-4">{doctor.specialty}</p>
                  
                  {doctor.rating && (
                    <div className="flex items-center justify-center md:justify-start mb-4">
                      <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium">{doctor.rating.toFixed(1)} Rating</span>
                      </div>
                    </div>
                  )}
                  
                  <Link href={`/public/booking?doctor=${doctor.id}`}>
                    <Button size="lg" className="mt-2">
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Doctor Info */}
              <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">About</h2>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">{doctor.bio}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4">Availability</h3>
                        
                        {doctor.availability ? (
                          <div className="space-y-3">
                            {Object.entries(doctor.availability as Record<string, string[]>).map(([day, hours]) => (
                              <div key={day} className="flex justify-between">
                                <span className="font-medium capitalize">{day}</span>
                                <span className="text-gray-600">
                                  {hours.length > 0 ? hours.join(', ') : 'Unavailable'}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">Availability information not provided.</p>
                        )}
                        
                        <div className="mt-6">
                          <Link href={`/public/booking?doctor=${doctor.id}`} className="w-full">
                            <Button className="w-full">
                              Check Available Slots
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}