
import type {NextConfig} from 'next';
import type { Configuration as WebpackConfiguration } from 'webpack';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      "https://9004-firebase-studio-1748913189989.cluster-l6vkdperq5ebaqo3qy4ksvoqom.cloudworkstations.dev",
      "https://9000-firebase-studio-1748913189989.cluster-l6vkdperq5ebaqo3qy4ksvoqom.cloudworkstations.dev",
      "https://6000-firebase-studio-1748913189989.cluster-l6vkdperq5ebaqo3qy4ksvoqom.cloudworkstations.dev", // Added port 6000
    ],
  },
  webpack: (
    config: WebpackConfiguration,
    { isServer }: { isServer: boolean; }
  ): WebpackConfiguration => {
    if (!isServer) {
      if (!config.resolve) {
        config.resolve = {};
      }
      if (!config.resolve.fallback) {
        config.resolve.fallback = {};
      }
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        tls: false,
        net: false,
        async_hooks: false,
        child_process: false,
        crypto: false,
        path: false,
        os: false,
        http: false,
        https: false,
        zlib: false,
        stream: false,
        http2: false,
        dns: false,
        dgram: false,
      };
    }

    if (isServer) {
      if (!config.externals) {
        config.externals = [];
      }
      const currentExternals = Array.isArray(config.externals) ? config.externals : [];
      config.externals = [
        ...currentExternals,
        {
          'http2': 'commonjs http2',
          'dns': 'commonjs dns',
          'dgram': 'commonjs dgram',
        }
      ];
    }

    return config;
  },
};

export default nextConfig;
