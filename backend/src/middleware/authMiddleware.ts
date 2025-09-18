import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    admin?: {id: number; username: string};
}

const authMiddleware =  (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({status:"error", message:"No token provided"});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET || "your_jwt_secret_key_1234567890") as {id:number; username:string};
        req.admin = {id: decoded.id, username: decoded.username};
        next();
    } catch (error) {
        return res.status(401).json({status:"error", message:"Invalid token"});
    }
}

export default authMiddleware;