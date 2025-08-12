# CRUD Application

## 📌 Overview

This is a simple **CRUD** (Create, Read, Update, Delete) application built as part of an internship task at **Claim Genius**.

The app allows users to manage personal records with the following fields:
- First Name
- Last Name  
- Date of Birth
- Mobile Number
- Address

## ✨ Features

- **Create** ➡ Add a new user via a form and save it to the PostgreSQL database
- **Read** ➡ View all users in a table below the form
- **Update** ➡ Edit a user's details directly in the table and save changes
- **Delete** ➡ Remove a user from the table and database

## 🛠️ Tech Stack

- **Frontend:** Vue.js + Tailwind CSS  
- **Backend:** Node.js + Express.js  
- **Database:** PostgreSQL  

The app is structured with separate folders for:
- `client/` → Frontend code  
- `server/` → Backend code  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone [https://github.com/your-username/your-repo-name.gi](https://github.com/Aryaagasti/crudApp)
cd your-repo-name
```

### 2️⃣ Frontend Setup (client/)

```bash
cd client
npm install
npm run build
```

### 3️⃣ Backend Setup (server/)

```bash
cd ../server
npm install
```

### 4️⃣ Database Setup

Create PostgreSQL Database & Table:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    address TEXT NOT NULL
);
```

### 5️⃣ Environment Variables

Create a `.env` file inside the `server/` folder:

```bash
DB_USER=your_postgres_user
DB_HOST=your_postgres_host
DB_NAME=your_database_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432
PORT=3000
```

### 6️⃣ Running the Application

#### Start Backend Server

```bash
cd server
npm run dev
```

#### Start Frontend Development Server

```bash
cd ../client
npm run dev
```

The application will be available at:
- **Frontend:** `http://localhost:5173` (or the port shown in terminal)
- **Backend API:** `http://localhost:3000`

---

## 📂 Project Structure

```
your-repo-name/
├── client/                 # Frontend Vue.js application
│   ├── src/
│   ├── package.json
│   └── ...
├── server/                 # Backend Express.js application  
│   ├── routes/
│   ├── package.json
│   ├── .env
│   └── ...
└── README.md
```

---

## 🚀 Usage

1. Open the application in your browser
2. Fill out the form with user details (First Name, Last Name, Date of Birth, Mobile Number, Address)
3. Click "Add User" to create a new record
4. View all users in the table below the form
5. Edit user details by clicking on table cells (if inline editing is enabled)
6. Delete users using the delete button in each row

---

## 🤝 Contributing

This project was created as part of an internship task at **Claim Genius**. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

This project is created for educational purposes as part of an internship program.

---

## 📞 Contact

For any questions or support, please reach out to the development team at Claim Genius.
