export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateDocument = (document: string): boolean => {
  // Basic validation - can be enhanced based on country requirements
  return document.length >= 5 && document.length <= 20;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return start >= today && end > start;
};

export const validateBookingRequest = (data: {
  guest_name: string;
  guest_email: string;
  guest_document: string;
  check_in: string;
  check_out: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!validateName(data.guest_name)) {
    errors.push('Nombre debe tener entre 2 y 50 caracteres');
  }

  if (!validateEmail(data.guest_email)) {
    errors.push('Email no válido');
  }

  if (!validateDocument(data.guest_document)) {
    errors.push('Documento de identidad no válido');
  }

  if (!validateDateRange(data.check_in, data.check_out)) {
    errors.push('Rango de fechas no válido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
