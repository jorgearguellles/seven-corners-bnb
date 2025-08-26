import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateDateRange } from '@/utils/validation';
import { getDaysBetween } from '@/utils/dateUtils';

export async function GET(request: NextRequest) {
  try {
    // Verificar que Supabase esté configurado
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase no está configurado' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get('check_in');
    const checkOut = searchParams.get('check_out');
    const apartmentId = searchParams.get('apartment_id');

    // Validar parámetros requeridos
    if (!checkIn || !checkOut || !apartmentId) {
      return NextResponse.json(
        { error: 'Fechas de check-in, check-out y apartment_id son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de fechas
    if (!validateDateRange(checkIn, checkOut)) {
      return NextResponse.json(
        { error: 'Rango de fechas no válido' },
        { status: 400 }
      );
    }

    // Consultar reservas existentes en el rango de fechas usando SQL más eficiente
    const { data: existingReservations, error: queryError } = await supabase
      .rpc('check_availability', {
        p_check_in: checkIn,
        p_check_out: checkOut,
        p_apartment_id: apartmentId
      });

    if (queryError) {
      // Fallback a consulta directa si la función RPC no existe
      console.log('RPC no disponible, usando consulta directa');

      const { data: directQuery, error: directError } = await supabase
        .from('reservations')
        .select('*')
        .eq('apartment_id', apartmentId)
        .or(`check_in.overlaps.tstzrange('${checkIn}', '${checkOut}'),check_out.overlaps.tstzrange('${checkIn}', '${checkOut}'),and(check_in.lte.${checkIn},check_out.gte.${checkOut})`)
        .eq('status', 'confirmed');

      if (directError) {
        console.error('Error consultando reservas:', directError);
        return NextResponse.json(
          { error: 'Error interno del servidor' },
          { status: 500 }
        );
      }

      const hasConflicts = directQuery && directQuery.length > 0;
      const isAvailable = !hasConflicts;

      // Calcular precio total si está disponible
      let totalPrice = 0;
      if (isAvailable) {
        const { data: apartment, error: apartmentError } = await supabase
          .from('apartments')
          .select('price_per_night')
          .eq('id', apartmentId)
          .single();

        if (apartmentError) {
          console.error('Error consultando apartamento:', apartmentError);
          return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
          );
        }

        const days = getDaysBetween(new Date(checkIn), new Date(checkOut));
        totalPrice = apartment.price_per_night * days;
      }

      return NextResponse.json({
        available: isAvailable,
        check_in: checkIn,
        check_out: checkOut,
        apartment_id: apartmentId,
        total_price: totalPrice,
        conflicting_reservations: hasConflicts ? directQuery : [],
      });
    }

    // Si la función RPC está disponible
    const hasConflicts = existingReservations && existingReservations.length > 0;
    const isAvailable = !hasConflicts;

    // Calcular precio total si está disponible
    let totalPrice = 0;
    if (isAvailable) {
      const { data: apartment, error: apartmentError } = await supabase
        .from('apartments')
        .select('price_per_night')
        .eq('id', apartmentId)
        .single();

      if (apartmentError) {
        console.error('Error consultando apartamento:', apartmentError);
        return NextResponse.json(
          { error: 'Error interno del servidor' },
          { status: 500 }
        );
      }

      const days = getDaysBetween(new Date(checkIn), new Date(checkOut));
      totalPrice = apartment.price_per_night * days;
    }

    return NextResponse.json({
      available: isAvailable,
      check_in: checkIn,
      check_out: checkOut,
      apartment_id: apartmentId,
      total_price: totalPrice,
      conflicting_reservations: hasConflicts ? existingReservations : [],
    });

  } catch (error) {
    console.error('Error en API availability:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
