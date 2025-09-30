import express from "express";
import { body } from "express-validator";
import { login, checkAuth , logout} from "../controllers/authController";

const router = express.Router();

//Admin login route
router.post("/auth/login",[body("username").notEmpty().withMessage("Username is required"), body("password").notEmpty().withMessage("Password is required")], login);

//auth check route
router.get("/auth/check", checkAuth);

// Admin logout route
router.post("/auth/logout", logout);

export default router;