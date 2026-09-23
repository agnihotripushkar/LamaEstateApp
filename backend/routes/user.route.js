import express from "express";
import { savePost, profilePosts, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../lib/verifyToken.js";

const router = express.Router();

router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.put("/:id", verifyToken, updateUser);

export default router;
