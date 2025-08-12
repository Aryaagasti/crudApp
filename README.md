# CRUD Application

## 📌 Overview
This is a simple **CRUD** (Create, Read, Update, Delete) application built as part of an internship task at **Claim Genius**.  
The app allows users to manage personal records with the following fields:

- First Name
- Last Name
- Date of Birth
- Mobile Number
- Address

**Features:**
- **Create** ➡ Add a new user via a form and save it to the PostgreSQL database.
- **Read** ➡ View all users in a table below the form.
- **Update** ➡ Edit a user's details directly in the table and save changes.
- **Delete** ➡ Remove a user from the table and database.

**Tech Stack:**
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
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

### 2️⃣Frontend Setup (client/)
```bash
cd client
npm install
npm run build

### 3️⃣  Backend Setup (server/)
```bash
cd ../server
npm install


### Create PostgreSQL Database & Table:
```bash
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    address TEXT NOT NULL
);

### 4️⃣ Environment Variables (.env in server/)
### Create a .env file inside server/ folder:
```bash
DB_USER=your_postgres_user
DB_HOST=your_postgres_host
DB_NAME=your_database_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432
PORT=3000

### 5️⃣ Running the Application
### Start Backend
```bash
cd server
npm run dev


### Start Frontend
```bash
cd ../client
npm run dev
