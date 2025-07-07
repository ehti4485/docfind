import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center space-x-2">
            <img src="/logo.svg" alt="DocFind Logo" className="h-10 w-10 brightness-0 invert" />
            <div>
              <h2 className="text-2xl font-bold">DocFind</h2>
              <p className="text-gray-400">Your health, our priority</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link>
            <Link href="/public/doctors" className="hover:text-indigo-400 transition-colors">Doctors</Link>
            <Link href="/auth/login" className="hover:text-indigo-400 transition-colors">Login</Link>
            <Link href="/auth/register" className="hover:text-indigo-400 transition-colors">Register</Link>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DocFind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}