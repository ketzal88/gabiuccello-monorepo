/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // libro.gabiuccello.com/venta → sirve el archivo estático public/venta.html
      // URL limpia para Meta Ads (sin extensión .html)
      { source: '/venta', destination: '/venta.html' },
    ];
  },
};

export default nextConfig;
