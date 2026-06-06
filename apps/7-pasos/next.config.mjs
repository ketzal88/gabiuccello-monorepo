/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ];
  },
};

export default nextConfig;
