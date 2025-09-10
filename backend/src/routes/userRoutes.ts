import express from "express";
import { body } from "express-validator";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController";

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post(
  '/users',
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('date_of_birth').isISO8601().withMessage('Valid date (YYYY-MM-DD) required'),
    body('mobile_number').matches(/^\d{10}$/).withMessage('Mobile number must be 10 digits'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  createUser
);
router.put(
  '/users/:id',
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('date_of_birth').isISO8601().withMessage('Valid date (YYYY-MM-DD) required'),
    body('mobile_number').matches(/^\d{10}$/).withMessage('Mobile number must be 10 digits'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  updateUser
);
router.delete('/users/:id', deleteUser);

export default router;