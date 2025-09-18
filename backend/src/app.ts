// app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//Routes
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

app.use(express.json());
app.use(cors());

app.use("/api/admin", authRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Optional: Create default admin (run once)
import AdminModel from "./models/Admin";

const createDefaultAdmin = async () => {
  try {
    await AdminModel.create({
      id: 1,
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
    });
    console.log("Default admin created");
  } catch (error) {
    console.error("Failed to create default admin:", (error as Error).message);
  }
};

// Uncomment to create default admin
 //createDefaultAdmin();

export default app;