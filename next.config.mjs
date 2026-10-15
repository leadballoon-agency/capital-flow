/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lab, Pine scripts and screenshots aren't part of the app
  outputFileTracingExcludes: { '*': ['lab/**', 'Capital Flow Oscillator/**', 'Indicator script/**'] },
  async rewrites() {
    // The older pages are still static HTML in public/
    return [{ source: '/', destination: '/index.html' }];
  },
  async redirects() {
    return [{ source: '/suite.html', destination: '/oscillator', permanent: false }];
  },
};

export default nextConfig;
