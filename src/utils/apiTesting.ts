// Utilidades para testing de las APIs

export const mockApartment = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Seven Corners Luxury Apartment',
  description: 'Hermoso apartamento de lujo ubicado en el corazón de la ciudad',
  price_per_night: 150.00,
  images: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
  ],
  amenities: ['WiFi gratuito', 'Aire acondicionado', 'Cocina equipada'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockReservation = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  apartment_id: '550e8400-e29b-41d4-a716-446655440000',
  guest_name: 'Juan Pérez',
  guest_email: 'juan@example.com',
  guest_document: '12345678',
  check_in: '2024-02-01',
  check_out: '2024-02-03',
  total_price: 300.00,
  status: 'pending',
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
};

export const mockAvailabilityResponse = {
  available: true,
  check_in: '2024-02-01',
  check_out: '2024-02-03',
  apartment_id: '550e8400-e29b-41d4-a716-446655440000',
  total_price: 300.00,
  conflicting_reservations: [],
};

export const mockBookingRequest = {
  guest_name: 'María García',
  guest_email: 'maria@example.com',
  guest_document: '87654321',
  check_in: '2024-03-01',
  check_out: '2024-03-03',
  apartment_id: '550e8400-e29b-41d4-a716-446655440000',
};

export const mockBookingResponse = {
  success: true,
  reservation: {
    ...mockBookingRequest,
    id: '550e8400-e29b-41d4-a716-446655440002',
    total_price: 300.00,
    status: 'pending',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  message: 'Reserva creada exitosamente',
};

// Función para simular delay en testing
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función para simular error de red
export const simulateNetworkError = () => {
  throw new Error('Error de red simulado');
};

// Función para simular respuesta exitosa con delay
export const simulateApiCall = async <T>(data: T, delayMs: number = 1000): Promise<T> => {
  await delay(delayMs);
  return data;
};

// Función para validar estructura de respuesta de disponibilidad
export const validateAvailabilityResponse = (response: any): boolean => {
  const requiredFields = ['available', 'check_in', 'check_out', 'apartment_id', 'total_price'];
  return requiredFields.every(field => field in response);
};

// Función para validar estructura de respuesta de reserva
export const validateBookingResponse = (response: any): boolean => {
  const requiredFields = ['success', 'reservation', 'message'];
  return requiredFields.every(field => field in response);
};

// Función para generar fechas de prueba
export const generateTestDates = (daysFromNow: number = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + daysFromNow);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 2);

  return {
    check_in: startDate.toISOString().split('T')[0],
    check_out: endDate.toISOString().split('T')[0],
  };
};

// Función para simular diferentes escenarios de disponibilidad
export const simulateAvailabilityScenarios = {
  available: () => Promise.resolve(mockAvailabilityResponse),
  unavailable: () => Promise.resolve({
    ...mockAvailabilityResponse,
    available: false,
    total_price: 0,
    conflicting_reservations: [mockReservation],
  }),
  error: () => Promise.reject(new Error('Error simulado de disponibilidad')),
  slow: () => delay(2000).then(() => mockAvailabilityResponse),
};
