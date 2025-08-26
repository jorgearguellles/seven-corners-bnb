-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create apartments table
CREATE TABLE apartments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    apartment_id UUID NOT NULL REFERENCES apartments (id) ON DELETE CASCADE,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_document VARCHAR(50) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'confirmed',
            'cancelled'
        )
    ),
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Create users table (admin only)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin')),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reservations_apartment_id ON reservations (apartment_id);

CREATE INDEX idx_reservations_dates ON reservations (check_in, check_out);

CREATE INDEX idx_reservations_status ON reservations (status);

CREATE INDEX idx_reservations_email ON reservations (guest_email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_apartments_updated_at BEFORE UPDATE ON apartments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample apartment data
INSERT INTO apartments (name, description, price_per_night, images, amenities) VALUES (
  'Seven Corners Luxury Apartment',
  'Hermoso apartamento de lujo ubicado en el corazón de la ciudad, con vistas espectaculares y todas las comodidades modernas. Perfecto para viajes de negocios o vacaciones familiares.',
  150.00,
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800', 'https://images.unsplash.com/photo-1560448204-5c3f6b3b3b3b?w=800'],
  ARRAY['WiFi gratuito', 'Aire acondicionado', 'Cocina equipada', 'TV Smart', 'Estacionamiento', 'Gimnasio', 'Piscina']
);

-- Enable Row Level Security (RLS)
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for apartments (public read access)
CREATE POLICY "Apartments are viewable by everyone" ON apartments FOR
SELECT USING (true);

-- Create policies for reservations (public insert, admin read/update)
CREATE POLICY "Reservations can be created by everyone" ON reservations FOR
INSERT
WITH
    CHECK (true);

CREATE POLICY "Reservations are viewable by admin" ON reservations FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM users
            WHERE
                users.id = auth.uid ()
                AND users.role = 'admin'
        )
    );

CREATE POLICY "Reservations can be updated by admin" ON reservations FOR
UPDATE USING (
    EXISTS (
        SELECT 1
        FROM users
        WHERE
            users.id = auth.uid ()
            AND users.role = 'admin'
    )
);

-- Create policies for users (admin only)
CREATE POLICY "Users are viewable by admin" ON users FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM users
            WHERE
                users.id = auth.uid ()
                AND users.role = 'admin'
        )
    );