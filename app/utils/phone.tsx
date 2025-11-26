export function normalizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = normalizePhone(phone);
  if (cleaned.length !== 10) return phone;
  
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}