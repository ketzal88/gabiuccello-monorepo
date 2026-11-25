/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // El libro vive fuera de public/ (solo se baja con login): hay que sumarlo al bundle de la función.
    outputFileTracingIncludes: {
      '/api/libro/[format]': ['./private/libro/*'],
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // shortcut: CSP solo con frame-ancestors; una CSP completa rompe Pixel, GA y los scripts inline de /venta.
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // libro.gabiuccello.com/ → /venta (la landing page de ventas es el home)
      { source: '/', destination: '/venta', permanent: false },
    ];
  },
  async rewrites() {
    return [
      // libro.gabiuccello.com/venta → sirve el archivo estático public/venta.html
      { source: '/venta', destination: '/venta.html' },
      // libro.gabiuccello.com/venta2 → variante low-ticket (A/B contra /venta)
      { source: '/venta2', destination: '/venta2.html' },
    ];
  },
};

export default nextConfig;
