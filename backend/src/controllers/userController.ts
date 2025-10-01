// controllers/userController.ts
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/User";
import { ValidationError } from "express-validator";

interface AuthRequest extends Request {
  admin?: { id: number; username: string; role?: string };
}

// Get all users with pagination and search
const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "5", search = "", sortBy = "id", order = "ASC" } = req.query;

    const currentPage = parseInt(page as string, 10);
    const perPage = parseInt(limit as string, 10);
    const offset = (currentPage - 1) * perPage;

    const users = await User.findAll({
      search: search as string,
      limit: perPage,
      offset,
      sortBy: sortBy as string,
      order: order as string,
    });

    const totalResult = await User.count(search as string);
    const totalPages = Math.ceil(totalResult / perPage);

    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: users,
      pagination: {
        total: totalResult,
        totalPages,
        currentPage,
        perPage,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Failed to retrieve users: ${(error as Error).message}`,
      data: null,
    });
  }
};

// Get single user by ID
const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(parseInt(req.params.id));
    
    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: `User not found: ${(error as Error).message}`,
      data: null,
    });
  }
};

// Create new user (admin+ only)
const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array() as ValidationError[],
      data: null,
    });
    return;
  }

  // Check permissions
  if(req.admin?.role !== 'super_admin' && req.admin?.role !== 'admin'){
    res.status(403).json({
      status: "error",  
      message: "Forbidden: You don't have permission to create users",
    });
    return; 
  }

  try {
    const user = await User.create(req.body);
    
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Failed to create user: ${(error as Error).message}`,
      data: null,
    });
  }
};

// Update user (admin+ only)
const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array() as ValidationError[],
      data: null,
    });
    return;
  }

  // Check permissions
  if(req.admin?.role !== 'super_admin' && req.admin?.role !== 'admin'){
    res.status(403).json({
      status: "error",  
      message: "Forbidden: You don't have permission to update users",
    });
    return; 
  }

  try {
    const user = await User.update(parseInt(req.params.id), req.body);
    
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    if ((error as Error).message === "User not found") {
      res.status(404).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: `Failed to update user: ${(error as Error).message}`,
        data: null,
      });
    }
  }
};

// Delete user (super_admin only)
const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array() as ValidationError[],
      data: null,
    });
    return;
  }

  // Only super_admin can delete
  if(req.admin?.role !== 'super_admin'){
    res.status(403).json({
      status: "error",
      message: "Forbidden: You don't have permission to delete users",
    });
    return; 
  }

  try {
    await User.delete(parseInt(req.params.id));
    
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    if ((error as Error).message === "User not found") {
      res.status(404).json({
        status: "error",
        message: "User not found",
        data: null,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: `Failed to delete user: ${(error as Error).message}`,
        data: null,
      });
    }
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };