import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import { ML_SERVICE_URL } from "./config.js";

const app = express();
const corsOptions = {
    origin: [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean),
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        message: "LamaEstate API is running!",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/post", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

// Proxy for Python ML Service
app.post("/api/predict", async (req, res) => {
    try {
        const response = await fetch(`${ML_SERVICE_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            throw new Error(`ML Service responded with ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("ML Service Error:", error.message);
        res.status(503).json({ message: "ML Service unavailable" });
    }
});

app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        message: status === 500 ? "Internal server error" : err.message
    });
});

export default app;
