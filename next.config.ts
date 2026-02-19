import type { NextConfig } from "next";

const config: NextConfig = {
  serverExternalPackages: ["cheerio"],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
    };
    return config;
  },
};

export default config;
