
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend ka URL (Vite default port)
    credentials: true, 
  })
);

// Routes
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

app.use("/api/admin", authRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Optional: Create default admin (run once)
import AdminModel from "./models/Admin";

const createDefaultAdmin = async () => {
  try {
    await AdminModel.create({
      id: 1,
      username: "admin",
      email: "admin@example.com",
      password: "admin123", // Production mein hash karo
    });
    console.log("Default admin created");
  } catch (error) {
    console.error("Failed to create default admin:", (error as Error).message);
  }
};

// Uncomment to create default admin
// createDefaultAdmin();

export default app;