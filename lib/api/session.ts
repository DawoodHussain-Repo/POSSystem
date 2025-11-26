// Session Recovery - Implements POSSystem.checkTemp() and continueFromTemp()

export interface SessionData {
  type: 'sale' | 'rental' | 'return';
  cart: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customerId?: string;
  customerPhone?: string;
  returnDate?: string;
  timestamp: string;
}

const SESSION_KEY = 'pos_session';

export function saveSession(data: SessionData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    }));
  }
}

export function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as SessionData;
  } catch {
    return null;
  }
}

export function hasSession(): boolean {
  return getSession() !== null;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getSessionType(): string | null {
  const session = getSession();
  return session?.type || null;
}
