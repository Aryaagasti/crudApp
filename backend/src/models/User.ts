
import pool from "../config/db";
import { User, UserQueryParams } from "../types";

class UserModel {
  static async create(user: Omit<User, 'id'>): Promise<User> {
    const { first_name, last_name, date_of_birth, mobile_number, address } = user;
    const result =  await pool.query(
      'INSERT INTO users (first_name, last_name, date_of_birth, mobile_number, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [first_name, last_name, date_of_birth, mobile_number, address]
    );
    return result.rows[0];
  }

   // In UserModel.ts
static async findAll(params: UserQueryParams & { offset: number }): Promise<User[]> {
  const { search, limit, offset, sortBy, order } = params;
  
  let query = 'SELECT * FROM users';
  const values: any[] = [];
  
  if (search) {
    query += ' WHERE first_name ILIKE $1 OR last_name ILIKE $1';
    values.push(`%${search}%`);
  }

  // Validate sortBy and order to prevent SQL injection
  const validSortColumns = ['id', 'first_name', 'last_name', 'date_of_birth', 'mobile_number', 'address'];
  const validOrder = ['ASC', 'DESC'];
  
  const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'id';
  const safeOrder = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
  
  query += ` ORDER BY ${safeSortBy} ${safeOrder}`;
  
  if (search) {
    query += ' LIMIT $2 OFFSET $3';
    values.push(limit, offset);
  } else {
    query += ' LIMIT $1 OFFSET $2';
    values.push(limit, offset);
  }

  const result = await pool.query(query, values);
  return result.rows;
}

  static async findAllBasic(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC')
    return result.rows;
  }

  static async findById(id: number): Promise<User> {
    const result = await pool.query(`
      SELECT 
        id,
        first_name,
        last_name,
        TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
        mobile_number,
        address
      FROM users
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0];
  }

  static async update(id: number, user: Omit<User, 'id'>): Promise<User> {
    const { first_name, last_name, date_of_birth, mobile_number, address } = user;
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, date_of_birth = $3, mobile_number = $4, address = $5 WHERE id = $6 RETURNING *',
      [first_name, last_name, date_of_birth, mobile_number, address, id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0];
  }

  static async delete(id: number): Promise<User> {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0];
  }

  static async count(search: string = ""): Promise<number> {
  let query = "SELECT COUNT(*) FROM users";
  const values: any[] = [];
  if (search) {
    query += " WHERE first_name ILIKE $1 OR last_name ILIKE $1";
    values.push(`%${search}%`);
  }
  const result = await pool.query(query, values);
  return parseInt(result.rows[0].count, 10);
}

}

export default UserModel;