import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DoctorCard from '@/components/ui/DoctorCard';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Find Doctors - DocFind',
  description: 'Browse and find the best doctors for your needs',
};

export default async function DoctorsPage() {
  const supabase = createClient();
  
  // Fetch doctors from Supabase
  const { data: doctors, error } = await supabase
    .from('doctors')
    .select('*')
    .order('name');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-indigo-600 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Find the Right Doctor</h1>
            <p className="text-xl max-w-2xl">Browse our selection of qualified healthcare professionals and book your appointment today.</p>
          </div>
        </section>
        
        {/* Doctors Listing */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {error ? (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to load doctors</h2>
                <p className="text-gray-600">Please try again later.</p>
              </div>
            ) : doctors && doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    id={doctor.id}
                    name={doctor.name}
                    specialty={doctor.specialty}
                    rating={doctor.rating}
                    imageUrl={doctor.image_url}
                    bio={doctor.bio}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No doctors found</h2>
                <p className="text-gray-600">Please check back later for available doctors.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}