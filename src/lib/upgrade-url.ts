// Construye la URL de upgrade de Stripe con el UID + fbp/fbc embebidos
// en client_reference_id. El webhook parsea el formato uid:UID||fbp||fbc.

// Default = Payment Link "Extra app de tracking" en Stripe live.
// Override por env var si se cambia el producto/link en el futuro.
const STRIPE_UPGRADE_LINK =
  process.env.NEXT_PUBLIC_STRIPE_LINK_UPGRADE ??
  "https://buy.stripe.com/3cI3cu3UR0Og5Bk2767IY02";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

export function buildUpgradeUrl(uid: string): string {
  const fbp = getCookie("_fbp");
  const fbc = getCookie("_fbc");
  const parts = [`uid:${uid}`, fbp, fbc].filter(Boolean);
  const ref = parts.join("||");

  const separator = STRIPE_UPGRADE_LINK.includes("?") ? "&" : "?";
  return `${STRIPE_UPGRADE_LINK}${separator}client_reference_id=${encodeURIComponent(ref)}`;
}
