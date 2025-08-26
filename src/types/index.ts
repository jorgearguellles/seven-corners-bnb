export interface Apartment {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  images: string[];
  amenities: string[];
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  apartment_id: string;
  guest_name: string;
  guest_email: string;
  guest_document: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin';
  created_at: string;
}

export interface AvailabilityResponse {
  available: boolean;
  conflicting_reservations?: Reservation[];
}

export interface BookingRequest {
  guest_name: string;
  guest_email: string;
  guest_document: string;
  check_in: string;
  check_out: string;
  apartment_id: string;
}
