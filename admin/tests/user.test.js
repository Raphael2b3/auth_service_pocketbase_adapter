import request from "supertest";
import app from "../src/server.js";

let adminToken = "your_test_admin_token";
let userId = "";

describe("🔹 Admin API Tests", () => {
    test("✅ Create a new user", async () => {
        const res = await request(app)
            .post("/admin/users")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ username: "testuser", email: "test@example.com" });

        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBeDefined();
        userId = res.body.id;
    });

    test("✅ Get user by ID", async () => {
        const res = await request(app)
            .get(`/admin/users/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.username).toBe("testuser");
    });

    test("✅ Update user data", async () => {
        const res = await request(app)
            .put(`/admin/users/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ email: "updated@example.com" });

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe("updated@example.com");
    });

    test("✅ Get all users", async () => {
        const res = await request(app)
            .get("/admin/users")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("✅ Delete user", async () => {
        const res = await request(app)
            .delete(`/admin/users/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
    });

    test("❌ Get deleted user", async () => {
        const res = await request(app)
            .get(`/admin/users/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(404);
    });
});
