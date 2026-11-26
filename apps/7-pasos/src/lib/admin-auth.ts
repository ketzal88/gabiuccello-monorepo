import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

// No es secreto: es la cuenta que puede usar /admin. Debe coincidir con src/app/admin/page.tsx.
export const ADMIN_EMAIL = 'gabriel@worker.ar';

// Admin = token válido de la cuenta admin con el mail verificado (sin email_verified,
// alguien podría registrar ese mail con email/password y pasar el chequeo).
export async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  try {
    const decoded = await adminAuth.verifyIdToken(auth.slice(7));
    return decoded.email === ADMIN_EMAIL && decoded.email_verified === true;
  } catch {
    return false;
  }
}
