import { Metadata } from 'next';
import Link from 'next/link';
import RegisterForm from '@/components/forms/RegisterForm';
import { Card, CardContent } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Register - DocFind',
  description: 'Create a new account to book appointments with doctors',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-indigo-600">
            Doctor Webapp
          </Link>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Create a new account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}