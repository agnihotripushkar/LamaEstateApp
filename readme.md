# MERN Home Rental App

A full-stack real estate application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to list, search, and view rental properties.

## 🚀 Features

*   **Property Listings:** Browse and search for rental properties (apartments, houses, condos, land).
*   **Interactive Maps:** View property locations on an interactive map using Leaflet.
*   **Detailed Views:** informative property details pages with images, descriptions, and amenities.
*   **Advanced Filtering:** Filter properties by city, price range, type, and more.
*   **User Roles:** distinct experiences for Customers (renting) and Realtors (listing).
*   **AI Price Prediction:** ML-powered price estimation on listing pages to assist with competitive pricing.
*   **Recommendation Engine:** Smart backend recommendation system suggesting relevant properties to users.
*   **User Authentication:** Secure login and registration system.
*   **Responsive Design:** optimized for both desktop and mobile devices.

## 🛠️ Tech Stack

### Frontend
*   **React:** UI library for building the user interface.
*   **Vite:** Fast build tool and development server.
*   **React Router DOM:** For seamless client-side client-side navigation.
*   **Sass:** CSS preprocessor for styling.
*   **Zustand:** State management.
*   **Leaflet / React-Leaflet:** For map integration.
*   **Axios:** For making HTTP requests.

### Backend
*   **Node.js:** Runtime environment.
*   **Express:** Web framework for Node.js.
*   **Prisma:** ORM for database interaction.
*   **MongoDB:** NoSQL database for storing data.
*   **JWT:** For secure authentication.
*   **Bcrypt:** For password hashing.

### AI / ML
*   **Python:** Programming language for AI models.
*   **Flask:** Micro web framework for serving ML models.
*   **Scikit-learn:** For machine learning algorithms.
*   **Pandas/NumPy:** Data manipulation and analysis.

## 📸 Screenshots

| Home Page | Filter Page |
|:---:|:---:|
| <img width="1440" alt="Home Page" src="https://github.com/user-attachments/assets/744d3272-6629-4999-b89a-e41e6aec2762"> | <img width="1440" alt="Filter Page" src="https://github.com/user-attachments/assets/c4f99064-efbf-4e7e-9768-767467bf96f9"> |

| Detail Page | Database Schema |
|:---:|:---:|
| <img width="1440" alt="Detail Page" src="https://github.com/user-attachments/assets/ea1ac759-4abe-4b52-a21b-de05c22e3f3b"> | <img width="954" alt="Schema" src="https://github.com/user-attachments/assets/7d0a5d5e-60f0-40c9-826c-b0d67ba92497"> |

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB instance
*   Python (v3.x or higher)

### Environment Variables

Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="mongodb+srv://..."
CLIENT_URL="http://localhost:5173"
JWT_SECRET_KEY="your-secret-key"
```

Create a `.env` file in the `frontend` directory (if needed for custom env vars, though mostly handled via config):
```env
# Example
VITE_API_URL="http://localhost:8800/api" 
```

### Installation & Run

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    npx prisma db push
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 🚀 Deployment

This project uses a monorepo structure. Each component is deployed separately.

*   **Frontend:** Vercel (recommended)
*   **Backend:** Heroku (using git subtree)
*   **AI Service:** Heroku (using git subtree)

See the README in each folder for specific instructions:
*   [Backend Deployment Rules](./backend/README.md)
*   [Frontend Deployment Rules](./frontend/README.md)
*   [AI Service Deployment Rules](./ml_service/README.md)
