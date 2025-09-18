// controllers/authController.ts
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

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || "your_jwt_secret_key_1234567890",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { token, admin: { id: admin.id, username: admin.username, email: admin.email } },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Login failed: ${(error as Error).message}`,
    });
  }
};

export { login };