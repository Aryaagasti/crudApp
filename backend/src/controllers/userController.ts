import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { ValidationError } from 'express-validator';

// GET ALL USERS (basic version without pagination)
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAllBasic(); // simple call
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// GET SPECIFIC USER BY ID
const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(parseInt(req.params.id));
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// CREATE USER
const createUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() as ValidationError[] });
    return;
  }
  
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// UPDATE AN EXISTING USER BY ID
const updateUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() as ValidationError[] });
    return;
  }
  
  try {
    const user = await User.update(parseInt(req.params.id), req.body);
    res.status(200).json(user);
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(400).json({ message: (error as Error).message });
    }
  }
};

// DELETE THE USER BY ID
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() as ValidationError[] });
    return;
  }
  
  try {
    await User.delete(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: (error as Error).message });
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