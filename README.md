# FMS User Application

A Next.js application for customers. Configured for Static Export to run on S3.

## Index
1.  [Run Locally](#run-locally)
2.  [Deploy to AWS S3](#deploy-to-aws-s3)

---

## Run Locally

### Prerequisites
- Node.js v18+

### Steps
1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```

3.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:3000`.

---

## Deploy to AWS S3

Since `output: 'export'` is set in `next.config.js`, this app builds to a collection of static HTML/CSS/JS files.

### Phase 1: Production Build
1.  **Configure Environment**:
    Create `.env.production`:
    ```env
    NEXT_PUBLIC_API_URL=http://<your-backend-alb-dns-or-ip>:8000/api
    ```
2.  **Build & Export**:
    ```bash
    npm run build
    ```
    *Output*: An `out` directory is created.

### Phase 2: S3 Bucket Setup
1.  **Create Bucket**:
    *   Go to **S3 Console** -> **Create bucket**.
    *   Name: `fms-user-app-<unique-suffix>`.
    *   **Block Public Access settings**: Uncheck "Block all public access".
2.  **Upload Assets**:
    *   Upload the **contents** of the `out` folder to the root of the bucket.
3.  **Static Website Hosting**:
    *   Go to **Properties** -> **Static website hosting** -> **Edit**.
    *   Enable.
    *   Index document: `index.html`.
    *   Error document: `404.html` (Next.js generates this).

### Phase 3: Permissions
1.  **Bucket Policy**:
    Go to **Permissions** -> **Bucket policy** and paste:
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::<your-bucket-name>/*"
            }
        ]
    }
    ```

### Phase 4: CloudFront (Highly Recommended)
Next.js static exports rely on clean URLs (e.g., `/dashboard` instead of `/dashboard.html`). S3 website hosting handles this for folders with `index.html`, but specific files might need configuration.

1.  **Create Distribution**:
    *   Origin Domain: Your S3 Bucket Website Endpoint.
2.  **Viewer Protocol Policy**: Redirect HTTP to HTTPS.
3.  **Custom Error Responses**:
    *   If you encounter 404s on refresh, set up a 404 rule pointing to `/index.html` or rely on `404.html` for actual missing pages.
