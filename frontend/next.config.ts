import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // A stray package-lock.json higher up the file system confuses root detection.
    root: path.resolve(__dirname),
  },
  sassOptions: {
    // Bootstrap 5.3 still uses @import and legacy colour functions.
    // Hide those warnings so real issues in our own SCSS stay visible.
    quietDeps: true,
    silenceDeprecations: ["import", "global-builtin", "color-functions", "if-function"],
  },
  async redirects() {
    return ["admin", "provider", "customer"].map((role) => ({
      source: `/${role}`,
      destination: `/${role}/dashboard`,
      permanent: false,
    }));
  },
};

export default nextConfig;
