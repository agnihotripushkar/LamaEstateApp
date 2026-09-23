# Backend Deployment

## Deploying to Heroku

Since this is a monorepo, you cannot push the root directory directly to Heroku. You must push only the `backend` subtree.

### 1. Create Heroku App
Create an app on Heroku (e.g., `home-rental-be`).

### 2. Add Remote
Add the Heroku git remote (if you haven't already):
```bash
git remote add heroku https://git.heroku.com/YOUR_APP_NAME.git
```

### 3. Deploy
Run this command from the **root** of your repository:
```bash
git subtree push --prefix backend heroku master
```
(Change `master` to `main` if your default branch is `main`).

## Environment Variables
Make sure to set these Config Vars in Heroku:
*   `DATABASE_URL`: Your MongoDB connection string.
*   `JWT_SECRET`: Secret key for tokens.
*   `CLIENT_URL`: URL of your deployed frontend (e.g., `https://your-frontend.vercel.app`).
