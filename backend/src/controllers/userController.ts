import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { ValidationError } from 'express-validator';

// GET ALL USERS with pagination
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
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

    // total count for pagination
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

// GET SPECIFIC USER BY ID
const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(parseInt(req.params.id));
    res.status(200).json({
      status: 'success',
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `User not found: ${(error as Error).message}`,
      data: null,
    });
  }
};

// CREATE USER
const createUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array() as ValidationError[],
      data: null,
    });
    return;
  }

  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Failed to create user: ${(error as Error).message}`,
      data: null,
    });
  }
};

// UPDATE AN EXISTING USER BY ID
const updateUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array() as ValidationError[],
      data: null,
    });
    return;
  }

  try {
    const user = await User.update(parseInt(req.params.id), req.body);
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
        data: null,
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: `Failed to update user: ${(error as Error).message}`,
        data: null,
      });
    }
  }
};

// DELETE THE USER BY ID
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array() as ValidationError[],
      data: null,
    });
    return;
  }

  try {
    await User.delete(parseInt(req.params.id));
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
      data: null,
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
        data: null,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: `Failed to delete user: ${(error as Error).message}`,
        data: null,
      });
    }
  }
};

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};