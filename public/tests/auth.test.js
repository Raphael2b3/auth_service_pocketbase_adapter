import request from "supertest";
import app from "../src/server.js";

describe("🔹 Authentication API Tests", () => {
  let token = "";
  let refreshToken = "";
  let userId = "testuser_" + Date.now(); // Unique ID for each test run
  let password = "TestPassword123!";

  /** ✅ REGISTER A USER **/
  test("✅ Register a new user", async () => {
    const res = await request(app)
      .post("/register")
      .send({ id: userId, password });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  /** ❌ REGISTER FAIL - USER EXISTS **/
  test("❌ Register with an existing user", async () => {
    const res = await request(app)
      .post("/register")
      .send({ id: userId, password });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("User already exists");
  });

  /** ✅ LOGIN **/
  test("✅ Login with valid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({ id: userId, password });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  /** ❌ LOGIN FAIL - WRONG PASSWORD **/
  test("❌ Login with incorrect password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ id: userId, password: "WrongPass123" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  /** ✅ VERIFY ACCESS **/
  test("✅ Verify access with valid token", async () => {
    const res = await request(app)
      .get("/verify_access")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.hasAccess).toBe(true);
  });

  /** ❌ VERIFY ACCESS FAIL - NO TOKEN **/
  test("❌ Verify access without a token", async () => {
    const res = await request(app).get("/verify_access");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("No token provided");
  });

  /** ❌ VERIFY ACCESS FAIL - INVALID TOKEN **/
  test("❌ Verify access with an invalid token", async () => {
    const res = await request(app)
      .get("/verify_access")
      .set("Authorization", "Bearer fake_token");

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid token");
  });

  /** ✅ GET USER DATA **/
  test("✅ Get user data", async () => {
    const res = await request(app)
      .get("/user_data")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.username).toBe(userId);
  });

  /** ❌ GET USER DATA FAIL - INVALID TOKEN **/
  test("❌ Get user data with an invalid token", async () => {
    const res = await request(app)
      .get("/user_data")
      .set("Authorization", "Bearer fake_token");

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid token");
  });

  /** ✅ UPDATE USER DATA **/
  test("✅ Update user data", async () => {
    const res = await request(app)
      .put("/update_user_data")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "newemail@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Updated successfully");
  });

  /** ❌ UPDATE USER DATA FAIL - INVALID TOKEN **/
  test("❌ Update user data with an invalid token", async () => {
    const res = await request(app)
      .put("/update_user_data")
      .set("Authorization", "Bearer fake_token")
      .send({ email: "newemail@example.com" });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid token");
  });

  /** ✅ REFRESH TOKEN **/
  test("✅ Refresh authentication token", async () => {
    const res = await request(app)
      .post("/refresh")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    refreshToken = res.body.token;
  });

  /** ❌ REFRESH TOKEN FAIL - INVALID TOKEN **/
  test("❌ Refresh token with an invalid token", async () => {
    const res = await request(app)
      .post("/refresh")
      .set("Authorization", "Bearer fake_token");

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid token");
  });

  /** ✅ LOGOUT **/
  test("✅ Logout user", async () => {
    const res = await request(app)
      .post("/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out");
  });

  /** ❌ ACCESS AFTER LOGOUT **/
  test("❌ Try to access after logout", async () => {
    const res = await request(app)
      .get("/verify_access")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Invalid token");
  });

  /** ✅ PASSWORD RESET **/
  test("✅ Request password reset", async () => {
    const res = await request(app)
      .post("/password_reset")
      .send({ id: userId });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Reset link sent");
  });

  /** ❌ PASSWORD RESET FAIL - UNKNOWN USER **/
  test("❌ Request password reset for unknown user", async () => {
    const res = await request(app)
      .post("/password_reset")
      .send({ id: "unknown_user" });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("User not found");
  });

  /** ✅ UNREGISTER (DELETE ACCOUNT) **/
  test("✅ Unregister and delete user", async () => {
    const res = await request(app)
      .delete("/unregister")
      .set("Authorization", `Bearer ${refreshToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted");
  });

  /** ❌ LOGIN AFTER UNREGISTER **/
  test("❌ Try logging in after account deletion", async () => {
    const res = await request(app)
      .post("/login")
      .send({ id: userId, password });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });
});
