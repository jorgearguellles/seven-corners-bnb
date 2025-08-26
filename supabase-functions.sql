-- Función RPC para verificar disponibilidad de fechas
CREATE OR REPLACE FUNCTION check_availability(
  p_check_in DATE,
  p_check_out DATE,
  p_apartment_id UUID
)
RETURNS TABLE (
  id UUID,
  check_in DATE,
  check_out DATE,
  status VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.check_in,
    r.check_out,
    r.status
  FROM reservations r
  WHERE r.apartment_id = p_apartment_id
    AND r.status = 'confirmed'
    AND (
      -- Verificar si hay solapamiento de fechas
      (r.check_in, r.check_out) OVERLAPS (p_check_in, p_check_out)
      OR
      -- Verificar si la nueva reserva está completamente contenida
      (r.check_in <= p_check_in AND r.check_out >= p_check_out)
      OR
      -- Verificar si la nueva reserva contiene completamente una existente
      (p_check_in <= r.check_in AND p_check_out >= r.check_out)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas de reservas por mes
CREATE OR REPLACE FUNCTION get_reservations_stats(
  p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)
)
RETURNS TABLE (
  month INTEGER,
  month_name TEXT,
  total_reservations BIGINT,
  total_revenue DECIMAL(10,2),
  avg_stay_duration NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(MONTH FROM r.check_in)::INTEGER as month,
    TO_CHAR(r.check_in, 'Month') as month_name,
    COUNT(*) as total_reservations,
    SUM(r.total_price) as total_revenue,
    AVG(r.check_out::DATE - r.check_in::DATE) as avg_stay_duration
  FROM reservations r
  WHERE EXTRACT(YEAR FROM r.check_in) = p_year
    AND r.status = 'confirmed'
  GROUP BY EXTRACT(MONTH FROM r.check_in), TO_CHAR(r.check_in, 'Month')
  ORDER BY month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener próximas reservas
CREATE OR REPLACE FUNCTION get_upcoming_reservations(
  p_days_ahead INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  check_in DATE,
  check_out DATE,
  total_price DECIMAL(10,2),
  status VARCHAR(20),
  apartment_name VARCHAR(255),
  days_until_checkin INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.guest_name,
    r.guest_email,
    r.check_in,
    r.check_out,
    r.total_price,
    r.status,
    a.name as apartment_name,
    (r.check_in::DATE - CURRENT_DATE)::INTEGER as days_until_checkin
  FROM reservations r
  JOIN apartments a ON r.apartment_id = a.id
  WHERE r.check_in >= CURRENT_DATE
    AND r.check_in <= CURRENT_DATE + INTERVAL '1 day' * p_days_ahead
    AND r.status IN ('pending', 'confirmed')
  ORDER BY r.check_in ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar disponibilidad de un rango de fechas
CREATE OR REPLACE FUNCTION check_date_range_availability(
  p_start_date DATE,
  p_end_date DATE,
  p_apartment_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  conflicting_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO conflicting_count
  FROM reservations r
  WHERE r.apartment_id = p_apartment_id
    AND r.status = 'confirmed'
    AND (
      (r.check_in, r.check_out) OVERLAPS (p_start_date, p_end_date)
      OR
      (r.check_in <= p_start_date AND r.check_out >= p_end_date)
      OR
      (p_start_date <= r.check_in AND p_end_date >= r.check_out)
    );
  
  RETURN conflicting_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Índices adicionales para mejorar performance
CREATE INDEX IF NOT EXISTS idx_reservations_check_in_check_out ON reservations (check_in, check_out);

CREATE INDEX IF NOT EXISTS idx_reservations_apartment_status ON reservations (apartment_id, status);

CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations (created_at DESC);

-- Comentarios para documentar las funciones
COMMENT ON FUNCTION check_availability IS 'Verifica disponibilidad de fechas para un apartamento específico';

COMMENT ON FUNCTION get_reservations_stats IS 'Obtiene estadísticas mensuales de reservas y ingresos';

COMMENT ON FUNCTION get_upcoming_reservations IS 'Obtiene reservas próximas con información del apartamento';

COMMENT ON FUNCTION check_date_range_availability IS 'Verifica si un rango de fechas está disponible para reserva';