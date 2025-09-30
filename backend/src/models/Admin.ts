import pool from "../config/db";
import bcrypt from "bcrypt";
import { Admin, Role, Permission } from "../types/index";

/**
 * AdminModel - Handles admin authentication and management
 */
class AdminModel {
  
  /**
   * Find admin by username or email (for login)
   */
  static async findByUsername(username: string): Promise<Admin | null> {
    const result = await pool.query(
      `SELECT a.*, r.name AS role_name, r.description AS role_description 
       FROM admins a 
       LEFT JOIN roles r ON a.role_id = r.id 
       WHERE a.username = $1 OR a.email = $1`,
      [username]
    );
    
    const admin = result.rows[0];
    if (admin) {
      // Convert to role object
      admin.role = {
        id: admin.role_id, 
        name: admin.role_name, 
        description: admin.role_description
      } as Role;
      
      delete admin.role_name;
      delete admin.role_description;
      return admin;
    }
    return null;
  }

  /**
   * Get permissions for a role
   */
  static async getPermissions(roleId: number): Promise<Permission[]> {
    const result = await pool.query(
      `SELECT id, name FROM permissions WHERE role_id = $1`,
      [roleId]
    );
    return result.rows;
  }

  /**
   * Create new admin user
   */
  static async create(admin: Omit<Admin, 'id' | 'created_at'>): Promise<Admin> {
    const { username, email, password } = admin;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Get admin role ID
    const roleId = (await pool.query("SELECT id FROM roles WHERE name = 'admin'")).rows[0].id;
    
    // Create admin
    const result = await pool.query(
      "INSERT INTO admins (username, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, roleId]
    );
    
    const newAdmin = result.rows[0];
    newAdmin.role = { 
      id: roleId, 
      name: 'admin', 
      description: 'Can manage users but not other admins' 
    };
    
    return newAdmin;
  }

  /**
   * Check if password is valid
   */
  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default AdminModel;