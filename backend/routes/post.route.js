import express from "express";
import { getPosts, getPost, getStats, getSimilarPosts, getNearbyPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/stats", getStats);
router.get("/nearby", getNearbyPosts); // Check this before /:id
router.get("/:id", getPost);
router.get("/:id/similar", getSimilarPosts);

export default router;
