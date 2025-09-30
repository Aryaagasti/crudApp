import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import AdminModel from "../models/Admin";
import jwt from "jsonwebtoken";
import { encryptData, decryptData } from "../utils/encryption";
import { AuthPayload, Permission } from "../types/index";

// User login
const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
    return;
  }

  const { username, password } = req.body;

  try {
    // Find user and validate password
    const admin = await AdminModel.findByUsername(username);
    if (!admin) {
      res.status(401).json({
        status: "error",
        message: "Invalid username or password",
      });
      return;
    }

    const isValidPassword = await AdminModel.validatePassword(password, admin.password);
    if (!isValidPassword) {
      res.status(401).json({
        status: "error",
        message: "Invalid username or password",
      });
      return;
    }

    // Create and sign JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({
        status: "error",
        message: "JWT secret not configured",
      });
      return;
    }

    const payload: AuthPayload = {
      id: admin.id,
      username: admin.username,
      role: admin.role?.name || "",
    };

    const encryptedPayload = encryptData(payload);
    const token = jwt.sign(
      { data: encryptedPayload },
      secret,
      { expiresIn: "1d" }
    );

    // Set HTTP-only cookie
    res.clearCookie("jwt");
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Get user permissions
    const permissions: Permission[] = admin.role_id ? await AdminModel.getPermissions(admin.role_id) : [];
    
    // Return user data
    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { 
        id: admin.id, 
        username: admin.username, 
        email: admin.email,
        role: admin.role?.name,
        permissions: permissions
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Login failed: ${(error as Error).message}`,
    });
  }
};

// Check if user is logged in
const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ isAuthenticated: false });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ isAuthenticated: false, message: "JWT secret not configured" });
      return;
    }

    const decoded = jwt.verify(token, secret) as { data: string };
    const decryptedData = decryptData(decoded.data) as AuthPayload;
    
    res.status(200).json({ isAuthenticated: true, role: decryptedData.role });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
};

// Logout user
const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  
  res.status(200).json({ status: "success", message: "Logged out successfully" });
};

export { login, checkAuth, logout };