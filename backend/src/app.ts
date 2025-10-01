const createDefaultUsers = async () => {
  try {
    // 1. Check and create Super Admin
    const checkSuperAdmin = await pool.query(
      'SELECT * FROM admins WHERE username = $1 OR email = $1',
      ['superadmin']
    );
    
    if (checkSuperAdmin.rows.length === 0) {
      const superAdminPassword = await bcrypt.hash('superadmin123', 10);
      
      await pool.query(
        `INSERT INTO admins (username, email, password, role_id, created_at) 
         VALUES ($1, $2, $3, $4, NOW())`,
        ['superadmin', 'superadmin@example.com', superAdminPassword, 1]
      );
      
      console.log("✅ Super Admin created successfully!");
    } else {
      console.log("✅ Super Admin already exists");
    }

    // 2. Check and create Admin
    const checkAdmin = await pool.query(
      'SELECT * FROM admins WHERE username = $1 OR email = $1',
      ['admin']
    );
    
    if (checkAdmin.rows.length === 0) {
      const adminPassword = await bcrypt.hash('admin1234', 10);
      
      await pool.query(
        `INSERT INTO admins (username, email, password, role_id, created_at) 
         VALUES ($1, $2, $3, $4, NOW())`,
        ['admin2', 'admin2@example.com', adminPassword, 2]
      );
      
      console.log("✅ Admin created successfully!");
    } else {
      console.log("✅ Admin already exists");
    }

    // 3. Check and create Regular User
    const checkUser = await pool.query(
      'SELECT * FROM admins WHERE username = $1 OR email = $1',
      ['testuser']
    );
    
    if (checkUser.rows.length === 0) {
      const userPassword = await bcrypt.hash('user123', 10);
      
      await pool.query(
        `INSERT INTO admins (username, email, password, role_id, created_at) 
         VALUES ($1, $2, $3, $4, NOW())`,
        ['testuser2', 'testuser2@example.com', userPassword, 3]
      );
      
      console.log("✅ Regular User created successfully!");
    } else {
      console.log("✅ Regular User already exists");
    }

    console.log("🎉 All default users checked/created successfully!");

  } catch (error) {
    console.error("❌ Failed to create default users:", (error as Error).message);
  }
};

// ✅ ISKO BHI COMMENT KARDO - Only uncomment for first time
createDefaultUsers();
