export const PORT = process.env.PORT || 8800;

// Python ML service (price prediction + recommendations)
export const ML_SERVICE_URL = process.env.ML_SERVICE_URL || process.env.PYTHON_SERVICE_URL || "http://127.0.0.1:5000";
