
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  admin?: { id: number; username: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt; // Cookie se token lo
  if (!token) {
    return res.status(401).json({ status: "error", message: "No token provided" });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ status: "error", message: "JWT secret not configured" });
  }
  try {
    const decoded = jwt.verify(token, secret) as { id: number; username: string };
    req.admin = { id: decoded.id, username: decoded.username };
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Invalid token" });
  }
};

export default authMiddleware;
