import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret";

const prismaMock = {
    user: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), count: jest.fn() },
    post: { findMany: jest.fn(), findUnique: jest.fn(), count: jest.fn() },
    savedPost: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), delete: jest.fn() },
};

jest.unstable_mockModule("../lib/prisma.js", () => ({ default: prismaMock }));

const { default: request } = await import("supertest");
const { default: app } = await import("../app.js");
const { default: bcrypt } = await import("bcrypt");

const authCookie = (payload = { id: "user1", role: "CUSTOMER" }) =>
    `token=${jwt.sign(payload, process.env.JWT_SECRET)}`;

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("app", () => {
    it("responds to the health check", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("healthy");
    });

    it("returns JSON 404 for unknown routes", async () => {
        const res = await request(app).get("/api/nope");
        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/Route not found/);
    });
});

describe("auth", () => {
    it("rejects registration with missing fields", async () => {
        prismaMock.user.findFirst.mockResolvedValue(null);
        const res = await request(app).post("/api/auth/register").send({ username: "a" });
        expect(res.status).toBe(400);
    });

    it("rejects duplicate usernames", async () => {
        prismaMock.user.findFirst.mockResolvedValue({ username: "taken", email: "x@y.z" });
        const res = await request(app)
            .post("/api/auth/register")
            .send({ username: "taken", email: "new@y.z", password: "secret1" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Username already exists!");
    });

    it("registers a new user with a hashed password", async () => {
        prismaMock.user.findFirst.mockResolvedValue(null);
        prismaMock.user.create.mockResolvedValue({});
        const res = await request(app)
            .post("/api/auth/register")
            .send({ username: "new", email: "new@y.z", password: "secret1" });
        expect(res.status).toBe(201);
        const { data } = prismaMock.user.create.mock.calls[0][0];
        expect(data.password).not.toBe("secret1");
        expect(await bcrypt.compare("secret1", data.password)).toBe(true);
    });

    it("logs in, sets a cookie and never returns the password", async () => {
        const password = await bcrypt.hash("secret1", 4);
        prismaMock.user.findUnique.mockResolvedValue({ id: "user1", username: "u", password, role: "CUSTOMER" });
        const res = await request(app).post("/api/auth/login").send({ username: "u", password: "secret1" });
        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"][0]).toMatch(/^token=/);
        expect(res.body.password).toBeUndefined();
    });

    it("rejects a wrong password", async () => {
        const password = await bcrypt.hash("secret1", 4);
        prismaMock.user.findUnique.mockResolvedValue({ id: "user1", username: "u", password });
        const res = await request(app).post("/api/auth/login").send({ username: "u", password: "wrong" });
        expect(res.status).toBe(400);
    });
});

describe("posts", () => {
    it("builds a filter from query params", async () => {
        prismaMock.post.findMany.mockResolvedValue([]);
        await request(app).get("/api/post?city=LA&minPrice=100&maxPrice=500&bedroom=2&property=house");
        expect(prismaMock.post.findMany).toHaveBeenCalledWith({
            where: {
                city: { contains: "LA", mode: "insensitive" },
                price: { gte: 100, lte: 500 },
                bedroom: 2,
                property: "house",
            },
            include: { postDetail: true },
        });
    });

    it("returns stats", async () => {
        prismaMock.post.count.mockResolvedValue(3);
        prismaMock.user.count.mockResolvedValue(5);
        const res = await request(app).get("/api/post/stats");
        expect(res.body).toMatchObject({ totalProperties: 3, totalUsers: 5 });
    });

    it("requires lat/lng for nearby posts", async () => {
        const res = await request(app).get("/api/post/nearby");
        expect(res.status).toBe(400);
    });

    it("returns an empty list when the ML service is down", async () => {
        const fetchSpy = jest.spyOn(global, "fetch").mockRejectedValue(new Error("ECONNREFUSED"));
        const res = await request(app).get("/api/post/abc/similar");
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
        fetchSpy.mockRestore();
    });

    it("loads recommended posts by id", async () => {
        const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => ["p1", "p2"] });
        prismaMock.post.findMany.mockResolvedValue([{ id: "p1" }, { id: "p2" }]);
        const res = await request(app).get("/api/post/nearby?lat=1&lng=2");
        expect(fetchSpy.mock.calls[0][0]).toMatch(/\/recommend\/nearby\?lat=1&lng=2$/);
        expect(res.body).toHaveLength(2);
        fetchSpy.mockRestore();
    });
});

describe("users", () => {
    it("requires auth to save a post", async () => {
        const res = await request(app).post("/api/users/save").send({ postId: "p1" });
        expect(res.status).toBe(401);
    });

    it("saves a post that is not yet saved", async () => {
        prismaMock.savedPost.findUnique.mockResolvedValue(null);
        prismaMock.savedPost.create.mockResolvedValue({});
        const res = await request(app).post("/api/users/save").set("Cookie", authCookie()).send({ postId: "p1" });
        expect(res.body.message).toBe("Post saved");
        expect(prismaMock.savedPost.create).toHaveBeenCalledWith({ data: { userId: "user1", postId: "p1" } });
    });

    it("unsaves a post that is already saved", async () => {
        prismaMock.savedPost.findUnique.mockResolvedValue({ id: "s1" });
        const res = await request(app).post("/api/users/save").set("Cookie", authCookie()).send({ postId: "p1" });
        expect(res.body.message).toBe("Post removed from saved list");
        expect(prismaMock.savedPost.delete).toHaveBeenCalledWith({ where: { id: "s1" } });
    });

    it("updates the current user's profile without returning the password", async () => {
        prismaMock.user.update.mockResolvedValue({ id: "user1", username: "renamed", password: "hash" });
        const res = await request(app)
            .put("/api/users/user1")
            .set("Cookie", authCookie())
            .send({ username: "renamed", password: "newsecret" });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: "user1", username: "renamed" });
        const { data } = prismaMock.user.update.mock.calls[0][0];
        expect(data.password).not.toBe("newsecret");
    });

    it("forbids updating another user's profile", async () => {
        const res = await request(app).put("/api/users/other").set("Cookie", authCookie()).send({ username: "x" });
        expect(res.status).toBe(403);
        expect(prismaMock.user.update).not.toHaveBeenCalled();
    });
});
