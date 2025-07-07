@echo off
echo ===================================
echo DocFind - Doctor Appointment Web App Setup
echo ===================================
echo.

echo Installing dependencies...
npm install

echo.
echo Creating .env.local file...
echo NEXT_PUBLIC_SUPABASE_URL=your_supabase_url > .env.local
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key >> .env.local

echo.
echo Setup complete!
echo.
echo IMPORTANT: Please update the .env.local file with your Supabase credentials.
echo.
echo To start the development server, run: npm run dev
echo.

pause