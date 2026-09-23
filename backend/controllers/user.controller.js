import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;

    try {
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                },
            },
        });

        if (savedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: savedPost.id,
                },
            });
            res.status(200).json({ message: "Post removed from saved list" });
        } else {
            await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId,
                },
            });
            res.status(200).json({ message: "Post saved" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to save post!" });
    }
};

export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const userPosts = await prisma.post.findMany({
            where: { userId: tokenUserId },
        });
        const saved = await prisma.savedPost.findMany({
            where: { userId: tokenUserId },
            include: {
                post: true,
            },
        });

        const savedPosts = saved.map((item) => item.post);
        res.status(200).json({ userPosts, savedPosts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get profile posts!" });
    }
};

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { password, avatar, username, email } = req.body;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "Not Authorized!" });
    }

    if (password && password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters!" });
    }

    try {
        const data = {};
        if (username) data.username = username;
        if (email) data.email = email;
        if (avatar !== undefined) data.avatar = avatar;
        if (password) data.password = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: { id },
            data,
        });

        const { password: userPassword, ...userInfo } = updatedUser;
        res.status(200).json(userInfo);
    } catch (err) {
        console.log(err);
        if (err.code === "P2002") {
            return res.status(400).json({ message: "Username or email already exists!" });
        }
        res.status(500).json({ message: "Failed to update user!" });
    }
};
