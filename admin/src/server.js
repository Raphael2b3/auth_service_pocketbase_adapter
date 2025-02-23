import express from "express";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(express.json());

app.use("/admin", adminRoutes);

export default app;