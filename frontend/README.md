# Frontend Deployment

## Deploying to Vercel

The easiest way to deploy the frontend is using Vercel.

### Option 1: Vercel Dashboard (Recommended)
1.  Go to the Vercel Dashboard.
2.  Import your GitHub repository.
3.  **Root Directory:** Edit the settings and set the "Root Directory" to `frontend`.
4.  **Build Command:** `npm run build` (default).
5.  **Output Directory:** `dist` (default for Vite).
6.  **Environment Variables:** Add your variables (e.g., `VITE_API_URL`).

### Option 2: Vercel CLI
If you want to deploy from the command line:

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Run deploy:
    ```bash
    vercel deploy
    ```

## Environment Variables
*   `VITE_API_URL`: The URL of your deployed backend (e.g., `https://home-rental-be.herokuapp.com/api`).
