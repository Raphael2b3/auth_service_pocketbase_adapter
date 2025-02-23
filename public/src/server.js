import express from "express";
import dotenv from "dotenv";
import { authController } from "./authController.js";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/register", authController.register);
app.post("/login", authController.login);
app.post("/logout", authController.logout);
app.get("/verify_access", authController.verifyAccess);
app.get("/user_data", authController.getUserData);
app.put("/update_user_data", authController.updateUserData);
app.get("/verify_user", authController.verifyUser);
app.post("/refresh", authController.refreshToken);
app.delete("/unregister", authController.unregister);
app.post("/password_reset", authController.passwordReset);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;