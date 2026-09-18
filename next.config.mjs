/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable automatic agent rules generation
  agentRules: false,

  // Image optimization config
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      {
        pathname: "/brand/**",
        search: "",
      },
      {
        pathname: "/event/**",
        search: "",
      },
      {
        pathname: "/gallery/**",
        search: "",
      },
      {
        pathname: "/videos/**",
        search: "",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },

  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
