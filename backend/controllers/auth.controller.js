import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already exists!" });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already exists!" });
            }
        }

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters!" });
        }

        // HASH THE PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATE A NEW USER AND SAVE TO DB
        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: req.body.role || "CUSTOMER"
            },
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.log(err);
        if (err.code === 'P2002') {
            // Prisma unique constraint error
            return res.status(400).json({ message: "Username or email already exists!" });
        }
        res.status(500).json({ message: "Failed to create user!" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // CHECK IF THE USER EXISTS
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

        // CHECK IF THE PASSWORD IS CORRECT
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
            return res.status(400).json({ message: "Invalid Credentials!" });

        // GENERATE COOKIE TOKEN AND SEND TO THE USER
        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                isAdmin: false,
            },
            process.env.JWT_SECRET,
            { expiresIn: age }
        );

        const { password: userPassword, ...userInfo } = user;

        res
            .cookie("token", token, {
                httpOnly: true,
                // secure:true,
                maxAge: age,
            })
            .status(200)
            .json(userInfo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to login!" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
