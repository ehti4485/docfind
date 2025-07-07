'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="DocFind Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold text-indigo-600">DocFind</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={cn(
                "font-medium transition-colors",
                isActive('/') ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
              )}
            >
              Home
            </Link>
            <Link 
              href="/public/doctors" 
              className={cn(
                "font-medium transition-colors",
                isActive('/public/doctors') ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
              )}
            >
              Doctors
            </Link>
            <Link 
              href="/auth/login" 
              className={cn(
                "font-medium transition-colors",
                isActive('/auth/login') ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
              )}
            >
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Sign Up
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={cn(
                  "font-medium transition-colors px-2 py-1",
                  isActive('/') ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/public/doctors" 
                className={cn(
                  "font-medium transition-colors px-2 py-1",
                  isActive('/public/doctors') ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Doctors
              </Link>
              <Link 
                href="/auth/login" 
                className={cn(
                  "font-medium transition-colors px-2 py-1",
                  isActive('/auth/login') ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}