import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Verificar que Supabase esté configurado
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase no está configurado' },
        { status: 500 }
      );
    }

    // TODO: Implementar autenticación de admin
    // Por ahora, permitimos acceso público para testing

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const apartmentId = searchParams.get('apartment_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Construir query base
    let query = supabase
      .from('reservations')
      .select(`
        *,
        apartments (
          name,
          price_per_night
        )
      `)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status);
    }

    if (apartmentId) {
      query = query.eq('apartment_id', apartmentId);
    }

    // Aplicar paginación
    query = query.range(offset, offset + limit - 1);

    const { data: reservations, error: queryError, count } = await query;

    if (queryError) {
      console.error('Error consultando reservas:', queryError);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    // Obtener total de registros para paginación
    let totalCount = 0;
    if (count === null) {
      const { count: total } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true });
      totalCount = total || 0;
    } else {
      totalCount = count;
    }

    return NextResponse.json({
      success: true,
      reservations,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Error en API reservations:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
