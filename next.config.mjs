/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle for the Docker/Fly image.
  output: "standalone",
  // better-sqlite3 is a native module — keep it out of the server bundle.
  // (Removed once the data layer fully moves to Drizzle/Neon in Phase 0b.)
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

export default nextConfig;
