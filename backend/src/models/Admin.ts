import pool from "../config/db";
import bcrypt from "bcrypt";
import {Admin} from "../types"

class AdminModel {
    static async findByUsername(username:string): Promise<Admin | null> {
        const result =  await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        return result.rows[0] || null;
    }

    static async create(admin: Omit<Admin, 'id | created_at'>): Promise<Admin> {
        const {username, email, password} =  admin;
        const hashedPassword =  await bcrypt.hash(password,10);
        const result = await pool.query("INSERT INTO admins (username, email, password) VALUES ($1, $2, $3) RETURNING *",[username, email, hashedPassword]);
        return result.rows[0];
        
    }

    static async validatePassword(plainPassword:string, hashedPassword:string): Promise<boolean> {
        return bcrypt.compare(plainPassword,hashedPassword)
    }
}

export default AdminModel;
