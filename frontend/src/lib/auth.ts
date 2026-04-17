export function getTokenPayload() {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      brandId: payload.brandId || '',
      brandName: payload.name || '',
      slug: payload.slug || '',
      role: payload.role || '',
    };
  } catch {
    return null;
  }
}
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

// keep backward compat
export function getBrandIdFromToken(): string {
  return getTokenPayload()?.brandId || '';
}