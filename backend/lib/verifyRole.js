// Must run after verifyToken, which sets req.user from the JWT payload.
export const verifyRealtor = (req, res, next) => {
    if (req.user && req.user.role === "REALTOR") {
        next();
    } else {
        return res.status(403).json({ message: "Not Authorized! Realtors only." });
    }
};
