
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

// ✅ ENVIRONMENT VARIABLES CHECK KARO
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET missing in .env file');
  process.exit(1);
}

if (!process.env.ENCRYPTION_KEY) {
  console.error('❌ ENCRYPTION_KEY missing in .env file');
  process.exit(1);
}

if (process.env.ENCRYPTION_KEY.length !== 32) {
  console.error('❌ ENCRYPTION_KEY must be exactly 32 characters long');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');

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

/// ✅ Create default user with role_id 3 using direct pool query
import pool from "./config/db"; // Adjust path according to your project
import bcrypt from 'bcrypt';

const createDefaultUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // ✅ Direct SQL query using pool - no model interference
    const query = `
      INSERT INTO admins (username, email, password, role_id, created_at) 
      VALUES ($1, $2, $3, $4, NOW()) 
      RETURNING id, username, email, role_id, created_at
    `;
    
    const values = ['testuser', 'testuser@example.com', hashedPassword, 3];
    const result = await pool.query(query, values);
    
    console.log("✅ Default user created successfully!");
    console.log("User ID:", result.rows[0].id);
    console.log("Username:", result.rows[0].username);
    console.log("Email:", result.rows[0].email);
    console.log("Role ID:", result.rows[0].role_id); // ✅ Definitely 3 hoga
    
  } catch (error) {
    console.error("❌ Failed to create default user:", (error as Error).message);
  }
};

// ✅ Uncomment to create default user
//createDefaultUser();

export default app;