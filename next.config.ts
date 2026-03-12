/**
 * Next.js Configuration
 *
 * Optimized for performance and security while maintaining full compatibility.
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	// React Strict Mode helps identify potential problems in development
	reactStrictMode: true,

	// Remove the "X-Powered-By: Next.js" header for security
	poweredByHeader: false,

	// Enable gzip/brotli compression (already enabled by default)
	compress: true,

	// Optimize images – add your external domains if you use next/image with external sources
	images: {
		domains: [], // e.g., ['example.com', 'cdn.example.com']
		// Enable modern image formats
		formats: ["image/avif", "image/webp"],
	},

	// Security headers applied to all routes
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY", // Prevents clickjacking
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff", // Stops MIME type sniffing
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin", // Controls referrer info
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()", // Restricts browser features
					},
					{
						key: "Content-Security-Policy",
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-inline' 'unsafe-eval'", // 'unsafe-inline' required for current code
							"style-src 'self' 'unsafe-inline'",
							"img-src 'self' data: https:",
							"font-src 'self'",
							"connect-src 'self'",
							"frame-ancestors 'none'",
						].join("; "),
					},
				],
			},
		]
	},

	// Build-time optimizations
	compiler: {
		// Remove console.log in production (except errors and warnings)
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
						exclude: ["error", "warn"],
					}
				: false,
	},

	// Disable source maps in production to reduce bundle size
	productionBrowserSourceMaps: false,

	// (Optional) Redirects – add any if needed
	// async redirects() {
	//   return []
	// },
}

export default nextConfig
