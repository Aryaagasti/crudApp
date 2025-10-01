import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { decryptData } from "../utils/encryption";
import { AuthPayload } from "../types/index";

// Add admin property to Request object
interface AuthRequest extends Request {
  admin?: AuthPayload;
}

/**
 * Auth Middleware - Protects routes by verifying JWT tokens
 */
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Get token from cookie
  const token = req.cookies.jwt;
  
  // Check if token exists
  if (!token) {
    return res.status(401).json({ 
      status: "error", 
      message: "No token provided" 
    });
  }

  // Check JWT secret
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ 
      status: "error", 
      message: "JWT secret not configured" 
    });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, secret) as { data: string };
    
    // Decrypt user data from token
    const decryptedData = decryptData(decoded.data) as AuthPayload;
    
    // Add admin data to request
    req.admin = decryptedData;
    
    // Continue to next middleware
    next();
  } catch (error) {
    // Handle invalid token
    return res.status(401).json({ 
      status: "error", 
      message: "Invalid token" 
    });
  }
};

export default authMiddleware;