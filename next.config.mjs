/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle for the Docker/Fly image.
  output: "standalone",
  // Keep node-postgres out of the server bundle (it dynamically requires
  // optional native/pure-JS backends that webpack shouldn't trace).
  experimental: {
    serverComponentsExternalPackages: ["pg"],
  },
};

export default nextConfig;
