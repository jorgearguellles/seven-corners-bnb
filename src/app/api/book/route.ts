import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateBookingRequest } from '@/utils/validation';
import { getDaysBetween } from '@/utils/dateUtils';

export async function POST(request: NextRequest) {
  try {
    // Verificar que Supabase esté configurado
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase no está configurado' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { guest_name, guest_email, guest_document, check_in, check_out, apartment_id } = body;

    // Validar datos de entrada
    const validation = validateBookingRequest({
      guest_name,
      guest_email,
      guest_document,
      check_in,
      check_out,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Datos de reserva no válidos', details: validation.errors },
        { status: 400 }
      );
    }

    // Verificar disponibilidad antes de crear la reserva
    const { data: existingReservations, error: availabilityError } = await supabase
      .from('reservations')
      .select('*')
      .eq('apartment_id', apartment_id)
      .or(`check_in.overlaps.tstzrange('${check_in}', '${check_out}'),check_out.overlaps.tstzrange('${check_in}', '${check_out}'),and(check_in.lte.${check_in},check_out.gte.${check_out})`)
      .eq('status', 'confirmed');

    if (availabilityError) {
      console.error('Error verificando disponibilidad:', availabilityError);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    if (existingReservations && existingReservations.length > 0) {
      return NextResponse.json(
        { error: 'Las fechas seleccionadas no están disponibles' },
        { status: 409 }
      );
    }

    // Obtener precio por noche del apartamento
    const { data: apartment, error: apartmentError } = await supabase
      .from('apartments')
      .select('price_per_night')
      .eq('id', apartment_id)
      .single();

    if (apartmentError) {
      console.error('Error consultando apartamento:', apartmentError);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    // Calcular precio total
    const days = getDaysBetween(new Date(check_in), new Date(check_out));
    const totalPrice = apartment.price_per_night * days;

    // Crear la reserva
    const { data: reservation, error: createError } = await supabase
      .from('reservations')
      .insert({
        apartment_id,
        guest_name,
        guest_email,
        guest_document,
        check_in,
        check_out,
        total_price: totalPrice,
        status: 'pending',
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creando reserva:', createError);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reservation,
      message: 'Reserva creada exitosamente',
    }, { status: 201 });

  } catch (error) {
    console.error('Error en API book:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
