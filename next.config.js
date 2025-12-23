/** @type {import('next').NextConfig} */
const nextConfig = {
    // For static export if needed, but BRD says 'Build static assets', which implies 'output: export' might be needed
    // However, Dashboard needs SSR/ISR. 
    // BRD said: "Frontend Hosting: Both frontends must be built as static assets and hosted on AWS S3."
    // BUT also: "Dashboard: Must use SSR or ISR."
    // CONTRADICTION: S3 hosting implies 'output: export' (SSG only). SSR/ISR requires Node server (or Lambda).
    // Given "Hosted on AWS S3", it strictly means Static Site. Next.js SSR functions won't work on S3 alone.
    // I will assume the user might mean Hybrid or just SSG with client-side fetching for "dynamic" parts if S3 is strict.
    // OR they deploy using Amplify/Vercel logic but on S3? 
    // Wait, "Dashboard: Must use SSR or ISR". This requires a server. 
    // Re-reading BRD: "Frontends... hosted on AWS S3" vs "Dashboard... SSR or ISR".
    // This is a conflict. 
    // I will create a standard Next.js app. If S3 hosting is hard constraint, SSR features will fail.
    // I will stick to standard build for now, but comment on this.
    // Actually, I'll set 'output: export' is safest for S3, but that disables SSR/ISR.
    // I will assume "static assets" means Client Side Rendering for dynamic parts (Dashboard) and SSG for Landing.
    // So "SSR" in BRD might be a misunderstanding of S3 capabilities by the user, or they mean "Client Side Fetching" behaving like dynamic content.
    // I will configure for standard build, but keep in mind S3 deployment means `next export` effectively.
    // However, next 14 `output: 'export'` is the way.
    // I'll leave default for now to allow `next start` (Node) dev, but for prod build, if they want S3, they need export.
    // I will add output: 'export' but warn about SSR.
    // Actually, I'll stick to default and let the build process handle it, but for "Static Frontends" requirement, I should probably use 'export'.
    // Let's use 'export' and rely on Client Components for dashboard data.
    output: 'export',
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
