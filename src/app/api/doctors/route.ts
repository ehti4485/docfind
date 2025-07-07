import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const specialty = searchParams.get('specialty');
  const name = searchParams.get('name');

  try {
    let query = supabase.from('doctors').select('*');

    // Apply filters if provided
    if (specialty) {
      query = query.eq('specialty', specialty);
    }

    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ doctors: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get specialties for filtering
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { action } = await request.json();

  try {
    if (action === 'getSpecialties') {
      const { data, error } = await supabase
        .from('doctors')
        .select('specialty')
        .order('specialty');

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Extract unique specialties
      const specialties = [...new Set(data.map(doctor => doctor.specialty))];

      return NextResponse.json({ specialties });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}