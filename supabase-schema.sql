-- Create tables for the DocFind Web Application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Doctors table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT,
  rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
  image_url TEXT,
  phone TEXT,
  email TEXT,
  availability JSON,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Create RLS (Row Level Security) policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Doctors policies (public read access)
CREATE POLICY "Anyone can view doctors"
  ON doctors FOR SELECT
  USING (true);

-- Appointments policies
CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments"
  ON appointments FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sample data for doctors
INSERT INTO doctors (name, specialty, bio, rating, image_url, phone, email, availability)
VALUES 
  ('John Smith', 'Cardiology', 'Dr. Smith is a board-certified cardiologist with over 15 years of experience.', 4.8, 'https://randomuser.me/api/portraits/men/1.jpg', '+1-555-123-4567', 'john.smith@example.com', '{"monday": ["09:00", "10:00", "11:00"], "tuesday": ["13:00", "14:00", "15:00"], "wednesday": ["09:00", "10:00", "11:00"], "thursday": ["13:00", "14:00", "15:00"], "friday": ["09:00", "10:00", "11:00"]}'),
  ('Sarah Johnson', 'Dermatology', 'Dr. Johnson specializes in treating skin conditions and performing cosmetic procedures.', 4.9, 'https://randomuser.me/api/portraits/women/1.jpg', '+1-555-234-5678', 'sarah.johnson@example.com', '{"monday": ["13:00", "14:00", "15:00"], "tuesday": ["09:00", "10:00", "11:00"], "wednesday": ["13:00", "14:00", "15:00"], "thursday": ["09:00", "10:00", "11:00"], "friday": ["13:00", "14:00", "15:00"]}'),
  ('Michael Chen', 'Pediatrics', 'Dr. Chen is passionate about children's health and has been practicing for 10 years.', 4.7, 'https://randomuser.me/api/portraits/men/2.jpg', '+1-555-345-6789', 'michael.chen@example.com', '{"monday": ["09:00", "10:00", "11:00", "13:00", "14:00"], "wednesday": ["09:00", "10:00", "11:00", "13:00", "14:00"], "friday": ["09:00", "10:00", "11:00", "13:00", "14:00"]}'),
  ('Emily Rodriguez', 'Orthopedics', 'Dr. Rodriguez specializes in sports medicine and joint replacements.', 4.6, 'https://randomuser.me/api/portraits/women/2.jpg', '+1-555-456-7890', 'emily.rodriguez@example.com', '{"tuesday": ["09:00", "10:00", "11:00", "13:00", "14:00"], "thursday": ["09:00", "10:00", "11:00", "13:00", "14:00"]}'),
  ('David Wilson', 'Neurology', 'Dr. Wilson is an expert in treating neurological disorders with a focus on migraines.', 4.5, 'https://randomuser.me/api/portraits/men/3.jpg', '+1-555-567-8901', 'david.wilson@example.com', '{"monday": ["13:00", "14:00", "15:00", "16:00"], "wednesday": ["13:00", "14:00", "15:00", "16:00"], "friday": ["13:00", "14:00", "15:00", "16:00"]}');