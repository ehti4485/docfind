import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  rating?: number;
  imageUrl?: string;
  bio: string;
}

export default function DoctorCard({ id, name, specialty, rating, imageUrl, bio }: DoctorCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
      
      <CardContent className="flex-grow py-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          {rating && (
            <div className="flex items-center bg-indigo-50 px-2 py-1 rounded text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-indigo-700 font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-indigo-600 font-medium mb-3">{specialty}</div>
        
        <p className="text-gray-600 text-sm line-clamp-3">{bio}</p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex space-x-2 w-full">
          <Link href={`/public/doctors/${id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
          <Link href={`/public/booking?doctor=${id}`} className="flex-1">
            <Button className="w-full">
              Book Appointment
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}