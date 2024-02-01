/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          // matching all API routes
          source: "/api/v1/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Content-Type", value : "*/*; charset=utf-8" },
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "*" },
          ]
        },
        {
          source: "/loaderio-ddf1cca9fa336591beb191ccd6b03a9a",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Content-Type", value : "*/*; charset=utf-8" },
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "*" },
          ]
        }
      ]
    },
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
}

module.exports = nextConfig
