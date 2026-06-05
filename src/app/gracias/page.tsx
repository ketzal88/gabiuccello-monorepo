'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useMemo } from 'react';

// IMPORTANTE: En cada Stripe Payment Link → Settings → Confirmation page:
// Seleccioná "Redirect customers to your website" con URLs distintas por producto:
//   Libro:    https://libro.gabiuccello.com/gracias?session_id={CHECKOUT_SESSION_ID}&type=book
//   Bundle:   https://libro.gabiuccello.com/gracias?session_id={CHECKOUT_SESSION_ID}&type=bundle
//   Upgrade:  https://libro.gabiuccello.com/gracias?session_id={CHECKOUT_SESSION_ID}&type=upgrade

type PurchaseType = 'book' | 'bundle' | 'upgrade';

const COPY: Record<PurchaseType, {
  eyebrow: string;
  headline: string;
  lead: string;
  body: string;
  cta: string;
  value: number;
  contentId: string;
}> = {
  book: {
    eyebrow: '✓ LIBRO CONFIRMADO',
    headline: 'Tu libro está listo.',
    lead: 'Revisá tu mail — te llegó el PDF, el EPUB y el acceso a la webapp.',
    body: 'Si más adelante querés sumar el sistema de tracking de hábitos, podés hacerlo desde adentro de la app por US$10 más.',
    cta: 'Entrar a la webapp →',
    value: 12.99,
    contentId: '7pasos-libro',
  },
  bundle: {
    eyebrow: '✓ ACCESO TOTAL ACTIVADO',
    headline: 'Bienvenido al sistema.',
    lead: 'Revisá tu mail. Te llegó el acceso al libro y a la app con todo activado.',
    body: 'El link de descarga y el acceso a la webapp están en tu bandeja de entrada. Si no lo ves, revisá spam. Arrancá hoy, no el lunes.',
    cta: 'Entrar a la app →',
    value: 19.99,
    contentId: '7pasos-bundle',
  },
  upgrade: {
    eyebrow: '✓ APP DESBLOQUEADA',
    headline: 'Listo. Tracking activado de por vida.',
    lead: 'Ya podés volver a la app — vas a ver Tracker, Objetivos y Progreso disponibles.',
    body: 'No tenés que hacer nada más. El acceso es inmediato y es para siempre.',
    cta: 'Volver a la app →',
    value: 10.0,
    contentId: '7pasos-upgrade-app',
  },
};

function GraciasContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') ?? '';
  const typeParam = searchParams.get('type') ?? 'bundle';
  const purchaseType: PurchaseType = useMemo(() => {
    if (typeParam === 'book' || typeParam === 'upgrade' || typeParam === 'bundle') {
      return typeParam;
    }
    return 'bundle';
  }, [typeParam]);

  const copy = COPY[purchaseType];

  useEffect(() => {
    if (!sessionId) return;

    // event_id IDÉNTICO al que envía el webhook CAPI: `purchase_${sessionId}`
    // Meta deduplica los dos eventos por event_id (1 conversión, no 2).
    const win = window as Window & { fbq?: (...args: unknown[]) => void };
    if (typeof win.fbq === 'function') {
      win.fbq('track', 'Purchase', {
        value: copy.value,
        currency: 'USD',
        content_ids: [copy.contentId],
        content_type: 'product',
        num_items: 1,
      }, { eventID: `purchase_${sessionId}` });
    }
  }, [sessionId, copy.value, copy.contentId]);

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
          {copy.eyebrow}
        </div>

        <h1 style={{
          fontFamily: 'Archivo Black, sans-serif',
          fontSize: 'clamp(32px, 6vw, 56px)',
          letterSpacing: '-0.03em',
          lineHeight: '1',
          marginBottom: '24px',
        }}>
          {copy.headline}
        </h1>

        <p style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontStyle: 'italic',
          fontSize: '20px',
          color: '#d4d4cf',
          marginBottom: '16px',
          lineHeight: '1.5',
        }}>
          {copy.lead}
        </p>

        <p style={{
          fontSize: '15px',
          color: '#8b8b85',
          marginBottom: '48px',
          lineHeight: '1.6',
        }}>
          {copy.body}
        </p>

        <a
          href={purchaseType === 'upgrade' ? '/dashboard' : '/login'}
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
          {copy.cta}
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
