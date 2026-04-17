// lib/auth.ts
export function getBrandIdFromToken(): string {
  if (typeof window === 'undefined') return '';
  
  const token = localStorage.getItem('token');
  if (!token) return '';

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.brandId || '';
  } catch {
    return '';
  }
}