import express from "express";
import { body } from "express-validator";
import { getAllUsers,createUser,deleteUser,updateUser,getUserById } from "../controllers/userController";

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('date_of_birth').isDate().withMessage('Date of birth must be a valid date'),
    body('mobile_number').isMobilePhone(['any']).withMessage('Mobile number must be a valid'),
    body('address').notEmpty().withMessage('Address is required')
],createUser);
router.put(
  "/users/:id",
  [
    body("first_name").notEmpty().withMessage("First name is required"),
    body("last_name").notEmpty().withMessage("Last name is required"),
    body("date_of_birth").isDate().withMessage("Valid date of birth required"),
    body("mobile_number")
      .isMobilePhone(['any']).withMessage("Enter a valid mobile number"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  updateUser
);
router.delete('/users/:id', deleteUser);

export default router;