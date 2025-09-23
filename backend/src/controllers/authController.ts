
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import AdminModel from "../models/Admin";
import jwt from "jsonwebtoken";

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

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({
        status: "error",
        message: "JWT secret not configured",
      });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      secret,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 din
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { id: admin.id, username: admin.username, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Login failed: ${(error as Error).message}`,
    });
  }
};

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

    jwt.verify(token, secret);
    res.status(200).json({ isAuthenticated: true });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ status: "success", message: "Logged out successfully" });
};

export { login, checkAuth, logout };
