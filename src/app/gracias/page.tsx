'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// IMPORTANTE: En Stripe Dashboard → tu Payment Link → Settings → Confirmation page:
// Seleccioná "Redirect customers to your website"
// URL: https://libro.gabiuccello.com/gracias?session_id={CHECKOUT_SESSION_ID}
// Stripe reemplaza {CHECKOUT_SESSION_ID} con el ID real de la sesión.

function GraciasContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') ?? '';

  useEffect(() => {
    if (!sessionId) return;

    // Dispara el evento Purchase en el Pixel client-side.
    // El event_id debe ser IDÉNTICO al que envía el webhook CAPI:
    //   event_id = `purchase_${sessionId}`
    // Meta detecta los dos eventos con el mismo event_id y los deduplica
    // (cuenta una sola conversión en lugar de dos).
    const win = window as Window & { fbq?: (...args: unknown[]) => void };
    if (typeof win.fbq === 'function') {
      win.fbq('track', 'Purchase', {
        value: 29.00,
        currency: 'USD',
        content_ids: ['7pasos-acceso-total'],
        content_type: 'product',
        num_items: 1,
      }, { eventID: `purchase_${sessionId}` });
    }
  }, [sessionId]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fafaf5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Manrope, system-ui, sans-serif',
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '560px' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          letterSpacing: '0.3em',
          color: '#f97316',
          marginBottom: '24px',
          textTransform: 'uppercase' as const,
        }}>
          ✓ COMPRA CONFIRMADA
        </div>

        <h1 style={{
          fontFamily: 'Archivo Black, sans-serif',
          fontSize: 'clamp(32px, 6vw, 56px)',
          letterSpacing: '-0.03em',
          lineHeight: '1',
          marginBottom: '24px',
        }}>
          Bienvenido al sistema.
        </h1>

        <p style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontStyle: 'italic',
          fontSize: '20px',
          color: '#d4d4cf',
          marginBottom: '16px',
          lineHeight: '1.5',
        }}>
          Revisá tu mail. Te llegó el acceso al libro y a la app.
        </p>

        <p style={{
          fontSize: '15px',
          color: '#8b8b85',
          marginBottom: '48px',
          lineHeight: '1.6',
        }}>
          El link de descarga y el acceso a la webapp están en tu bandeja de entrada.
          Si no lo ves, revisá spam. Arrancá hoy, no el lunes.
        </p>

        <a
          href="/"
          style={{
            display: 'inline-block',
            background: '#f97316',
            color: '#0a0a0a',
            padding: '16px 32px',
            borderRadius: '6px',
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: '14px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.04em',
            textDecoration: 'none',
          }}
        >
          Ir a la app →
        </a>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0a0a0a' }} />
    }>
      <GraciasContent />
    </Suspense>
  );
}
