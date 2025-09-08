const pool = require('../config/db');

class User {
  static async create(user) {
    const { first_name, last_name, date_of_birth, mobile_number, address } = user;
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, date_of_birth, mobile_number, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [first_name, last_name, date_of_birth, mobile_number, address]
    );
    return result.rows[0];
  }

static async findAll({search, limit, offset, SortBy, order}) {
  let query =  'SELECT * FROM users';
  const values = [];
  if (search){
    query += 'WHERE first_name ILIKE $1 OR last_name ILIKE $1';
    values.push(`%${search}%`);
  }

  query += `ORDER BY ${SortBy} ${order}`
  query += ' LIMIT $2 OFFSET $3';
  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
}

static async findAll() {
  const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
  return result.rows;
}



static async findById(id) {
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
  static async update(id, user) {
    const { first_name, last_name, date_of_birth, mobile_number, address } = user;
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, date_of_birth = $3, mobile_number = $4, address = $5 WHERE id = $6 RETURNING *',
      [first_name, last_name , date_of_birth, mobile_number, address, id]
    );
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0];
  }
}

module.exports = User;
