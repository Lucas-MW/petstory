export const normalizedPhone = (value: string): string => {
  return value.replace(/\D/g, '');
}

export const formatPhoneNumber = (digits: string): string => {
  if (digits.length <= 3) return `${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}
