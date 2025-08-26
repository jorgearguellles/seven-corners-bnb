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

    const { searchParams } = new URL(request.url);
    const apartmentId = searchParams.get('id');

    if (!apartmentId) {
      return NextResponse.json(
        { error: 'ID del apartamento es requerido' },
        { status: 400 }
      );
    }

    // Obtener información del apartamento
    const { data: apartment, error: apartmentError } = await supabase
      .from('apartments')
      .select('*')
      .eq('id', apartmentId)
      .single();

    if (apartmentError) {
      if (apartmentError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Apartamento no encontrado' },
          { status: 404 }
        );
      }

      console.error('Error consultando apartamento:', apartmentError);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      apartment,
    });

  } catch (error) {
    console.error('Error en API apartment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
