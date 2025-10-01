import express from "express";
import { body } from "express-validator";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware"

const router = express.Router();

// All routes require authentication
router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, getUserById);

// Create user with validation
router.post(
  '/users',
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('date_of_birth').isISO8601().withMessage('Valid date (YYYY-MM-DD) required'),
    body('mobile_number').matches(/^\d{10}$/).withMessage('Mobile number must be 10 digits'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  authMiddleware,
  createUser
);

// Update user with validation
router.put(
  '/users/:id',
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('date_of_birth').isISO8601().withMessage('Valid date (YYYY-MM-DD) required'),
    body('mobile_number').matches(/^\d{10}$/).withMessage('Mobile number must be 10 digits'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  authMiddleware,
  updateUser
);

// Delete user
router.delete('/users/:id', authMiddleware, deleteUser);

export default router;