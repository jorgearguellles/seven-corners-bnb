import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends ApiResponse<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await apiFunction(...args);
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// Hook específico para consultar disponibilidad
export function useAvailability() {
  return useApi(async (checkIn: string, checkOut: string, apartmentId: string) => {
    const params = new URLSearchParams({
      check_in: checkIn,
      check_out: checkOut,
      apartment_id: apartmentId,
    });

    const response = await fetch(`/api/availability?${params}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error consultando disponibilidad');
    }

    return response.json();
  });
}

// Hook específico para crear reservas
export function useBooking() {
  return useApi(async (bookingData: {
    guest_name: string;
    guest_email: string;
    guest_document: string;
    check_in: string;
    check_out: string;
    apartment_id: string;
  }) => {
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error creando reserva');
    }

    return response.json();
  });
}

// Hook específico para obtener información del apartamento
export function useApartment() {
  return useApi(async (apartmentId: string) => {
    const params = new URLSearchParams({ id: apartmentId });
    const response = await fetch(`/api/apartment?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error obteniendo información del apartamento');
    }

    return response.json();
  });
}

// Hook específico para obtener reservas (admin)
export function useReservations() {
  return useApi(async (filters?: {
    status?: string;
    apartment_id?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.apartment_id) params.append('apartment_id', filters.apartment_id);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`/api/reservations?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error obteniendo reservas');
    }

    return response.json();
  });
}
