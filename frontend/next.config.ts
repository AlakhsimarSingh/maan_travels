import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ccvoywbtkizjerlyikkc.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/airport-transfers/:path*",                            destination: "/airport-transfer",         permanent: true },
      { source: "/ride-self-drive/:path*",                              destination: "/self-drive",               permanent: true },
      { source: "/cab-booking/go-taxi/:path*",                          destination: "/go-taxi",                  permanent: true },
      { source: "/cab-booking/tempo-urbania-travellers/:path*",         destination: "/tempo-traveller-urbania",  permanent: true },
      { source: "/tour-itineraries/:path*",                             destination: "/tour-packages",            permanent: true },
      { source: "/cab-booking/:path*",                                  destination: "/",                         permanent: true },
      { source: "/theme",                                               destination: "/",                         permanent: true },
    ];
  },
};

export default nextConfig;
