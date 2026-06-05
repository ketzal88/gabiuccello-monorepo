// Construye la URL de upgrade de Stripe con el UID + fbp/fbc embebidos
// en client_reference_id. El webhook parsea el formato uid:UID||fbp||fbc.

const STRIPE_UPGRADE_LINK = process.env.NEXT_PUBLIC_STRIPE_LINK_UPGRADE ?? "";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

export function buildUpgradeUrl(uid: string): string {
  if (!STRIPE_UPGRADE_LINK) {
    // Fallback: si no está seteado el link, redirige a la página /upgrade
    // donde el usuario ve el error de configuración
    return "/upgrade";
  }

  const fbp = getCookie("_fbp");
  const fbc = getCookie("_fbc");
  const parts = [`uid:${uid}`, fbp, fbc].filter(Boolean);
  const ref = parts.join("||");

  const separator = STRIPE_UPGRADE_LINK.includes("?") ? "&" : "?";
  return `${STRIPE_UPGRADE_LINK}${separator}client_reference_id=${encodeURIComponent(ref)}`;
}
