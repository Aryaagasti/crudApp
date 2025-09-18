import express from "express";
import { body } from "express-validator";
import { login } from "../controllers/authController";

const router = express.Router();

//Admin login route
router.post("/auth/login",[body("username").notEmpty().withMessage("Username is required"), body("password").notEmpty().withMessage("Password is required")], login);

export default router;