import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { ML_SERVICE_URL } from "../config.js";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    // Build filter object based on query parameters
    const filter = {};

    if (query.city) {
      filter.city = {
        contains: query.city,
        mode: 'insensitive'
      };
    }

    if (query.minPrice && query.minPrice !== "" && parseInt(query.minPrice) > 0) {
      filter.price = {
        ...filter.price,
        gte: parseInt(query.minPrice)
      };
    }

    if (query.maxPrice && query.maxPrice !== "" && parseInt(query.maxPrice) > 0) {
      filter.price = {
        ...filter.price,
        lte: parseInt(query.maxPrice)
      };
    }

    if (query.property) {
      filter.property = query.property;
    }

    if (query.bedroom) {
      filter.bedroom = parseInt(query.bedroom);
    }

    const posts = await prisma.post.findMany({
      where: filter,
      include: {
        postDetail: true
      }
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true
      },
    });

    let isSaved = false;
    const token = req.cookies.token;

    if (token) {
      // Optional auth: an invalid token just means "not saved".
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });
        isSaved = saved ? true : false;
      } catch (e) {
        // ignore invalid token
      }
    }

    res.status(200).json({ ...post, isSaved });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

// Marketing figures shown on the home page; not derived from data.
const YEARS_OF_EXPERIENCE = 16;
const AWARDS = 200;

export const getStats = async (req, res) => {
  try {
    const [totalProperties, totalUsers] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
    ]);

    res.status(200).json({
      totalProperties,
      totalUsers,
      yearsOfExperience: YEARS_OF_EXPERIENCE,
      awards: AWARDS,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get statistics" });
  }
};

// Asks the ML service for recommended post ids, then loads those posts.
// Recommendations are optional, so failures are logged and yield an empty list.
const getRecommendedPosts = async (path, label) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}${path}`);
    if (!response.ok) {
      throw new Error(`ML service responded with ${response.status}`);
    }

    const recommendedIds = await response.json();
    if (!Array.isArray(recommendedIds) || recommendedIds.length === 0) {
      return [];
    }

    return await prisma.post.findMany({
      where: { id: { in: recommendedIds } },
      include: { postDetail: true },
    });
  } catch (err) {
    console.error(`[recommendations] ${label} failed: ${err.message}`);
    return [];
  }
};

export const getSimilarPosts = async (req, res) => {
  const posts = await getRecommendedPosts(
    `/recommend/similar/${encodeURIComponent(req.params.id)}`,
    "similar"
  );
  res.status(200).json(posts);
};

export const getNearbyPosts = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and Longitude are required" });
  }

  const params = new URLSearchParams({ lat, lng });
  const posts = await getRecommendedPosts(`/recommend/nearby?${params}`, "nearby");
  res.status(200).json(posts);
};
