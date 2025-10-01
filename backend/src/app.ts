
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
    origin: ["https://crud-app-nine-ebon.vercel.app", "http://localhost:513"], // Frontend ka URL (Vite default port)
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

const createDefaultUsers = async () => {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test database connection first
    const testConnection = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', testConnection.rows[0].now);

    // Check if roles table has data
    const rolesCheck = await pool.query('SELECT * FROM roles');
    console.log('👥 Existing roles:', rolesCheck.rows);

    // If no roles exist, create them first
    if (rolesCheck.rows.length === 0) {
      console.log('📝 Creating default roles...');
      await pool.query(`
        INSERT INTO roles (name, description) VALUES 
        ('super_admin', 'Has full access to all features'),
        ('admin', 'Can manage users but not other admins'),
        ('user', 'Can only view users')
      `);
      console.log('✅ Default roles created');
    }

    // 1. Check and create Super Admin
    const checkSuperAdmin = await pool.query(
      'SELECT * FROM admins WHERE username = $1 OR email = $1',
      ['superadmin']
    );
    
    console.log('🔍 Super Admin check:', checkSuperAdmin.rows.length);
    
    if (checkSuperAdmin.rows.length === 0) {
      const superAdminPassword = await bcrypt.hash('superadmin123', 10);
      
      const result = await pool.query(
        `INSERT INTO admins (username, email, password, role_id, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
        ['superadmin', 'superadmin@example.com', superAdminPassword, 1]
      );
      
      console.log("✅ Super Admin created with ID:", result.rows[0].id);
    } else {
      console.log("✅ Super Admin already exists");
    }

    // 2. Check and create Admin
    const checkAdmin = await pool.query(
      'SELECT * FROM admins WHERE username = $1 OR email = $1',
      ['admin']
    );
    
    console.log('🔍 Admin check:', checkAdmin.rows.length);
    
    if (checkAdmin.rows.length === 0) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      
      const result = await pool.query(
        `INSERT INTO admins (username, email, password, role_id, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
        ['admin2', 'admin2@example.com', adminPassword, 2]
      );
      
      console.log("✅ Admin created with ID:", result.rows[0].id);
    } else {
      console.log("✅ Admin already exists");
    }

    // 3. Check and create Regular User
    const checkUser = await pool.query(
      'SELECT * FROM admins WHERE username = $1 OR email = $1',
      ['testuser']
    );
    
    console.log('🔍 Regular User check:', checkUser.rows.length);
    
    if (checkUser.rows.length === 0) {
      const userPassword = await bcrypt.hash('user123', 10);
      
      const result = await pool.query(
        `INSERT INTO admins (username, email, password, role_id, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
        ['testuser2', 'testuser2@example.com', userPassword, 3]
      );
      
      console.log("✅ Regular User created with ID:", result.rows[0].id);
    } else {
      console.log("✅ Regular User already exists");
    }

    console.log("🎉 All default users checked/created successfully!");

  } catch (error) {
    console.error("❌ FAILED TO CREATE DEFAULT USERS - DETAILED ERROR:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error detail:", error.detail);
    console.error("Full error:", error);
  }
};

// ✅ Uncomment only for first time setup
// createDefaultUsers();
// ✅ ISKO BHI COMMENT KARDO - Only uncomment for first time
createDefaultUsers();

export default app;
