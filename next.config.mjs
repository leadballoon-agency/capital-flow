/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lab, Pine scripts and screenshots aren't part of the app
  outputFileTracingExcludes: { '*': ['lab/**', 'Capital Flow Oscillator/**', 'Indicator script/**'] },
  async redirects() {
    // Old static .html addresses keep working
    const pages = ['about', 'disclaimer', 'methodology', 'privacy', 'reports', 'strategies', 'suggest'];
    return [
      { source: '/index.html', destination: '/', permanent: true },
      ...pages.map((p) => ({ source: `/${p}.html`, destination: `/${p}`, permanent: true })),
      // The CF Osc page became the homepage on 2026-10-16; the old dashboard homepage lives at /signals
      { source: '/oscillator', destination: '/', permanent: false },
      { source: '/suite.html', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
