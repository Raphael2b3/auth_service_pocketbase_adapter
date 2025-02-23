import express from "express";
import { authenticateAdmin } from "../authMiddleware.js";
import { createUser, getAllUsers, getUser, updateUser, deleteUser } from "../userController.js";

const router = express.Router();

router.post("/users", authenticateAdmin, createUser);
router.get("/users", authenticateAdmin, getAllUsers);
router.get("/users/:id", authenticateAdmin, getUser);
router.put("/users/:id", authenticateAdmin, updateUser);
router.delete("/users/:id", authenticateAdmin, deleteUser);

export default router;