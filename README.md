# StaffSync

A human resource management web app built as a capstone project for the Full Stack
Development (MERN Stack) course on SkillWallet. An admin manages employees and approves
leave requests, and employees mark their own attendance and apply for leave.

**Author:** Sudheer Sahu

## Features

**Admin**
- Dashboard with total employees, people present today, pending leaves and a department count
- Add, edit and delete employees
- See everyone's attendance for any date
- Approve or reject leave requests

**Employee**
- Check in and check out once a day
- View attendance history (last 30 days)
- Apply for leave and track its status

**General**
- Login with JWT tokens, passwords hashed with bcrypt
- Role-based access, enforced on the server so employees can't call admin routes

## Built with

React (Vite), React Router, Node.js, Express, MongoDB with Mongoose, JWT, bcrypt

## Running it locally

You need Node.js and MongoDB installed, with MongoDB running.

1. Backend
   ```
   cd server
   npm install
   ```
   Copy `.env.example` to `.env` (the defaults work with a local MongoDB), then:
   ```
   npm run seed
   npm run dev
   ```
   You should see "MongoDB connected" and "Server running".

2. Frontend, in a second terminal
   ```
   cd client
   npm install
   npm run dev
   ```

3. Open http://localhost:5174

Demo accounts (created by the seed script, not for real use):

| Role | Email | Password |
|---|---|---|
| Admin | admin@staffsync.com | admin123 |
| Employee | riya@staffsync.com | emp123 |

`npm run seed` wipes the database and resets it. Employees added by the admin get the
default password `welcome123`.

## How it works

The React app calls the Express API with `fetch` and the server replies with JSON. Vite
proxies any request starting with `/api` to the backend on port 5001, which avoids CORS
problems in development. After login the server returns a JWT, the frontend stores it and
sends it in the `Authorization` header, and the `protect` middleware verifies it. Routes
that only admins should use also go through `adminOnly`, which checks the role stored in
the token.

Attendance has a unique index on (user, date), so the database itself guarantees one record
per person per day. Leave decisions only update requests that are still `pending`, so a
request can't be approved twice.

## API endpoints

| Method | Route | Access | What it does |
|---|---|---|---|
| POST | /api/auth/login | public | log in, returns a token |
| GET | /api/employees/stats | admin | dashboard numbers |
| GET | /api/employees | admin | list employees |
| POST | /api/employees | admin | add an employee |
| PUT | /api/employees/:id | admin | edit an employee |
| DELETE | /api/employees/:id | admin | delete employee and their records |
| POST | /api/attendance/checkin | logged in | check in for today |
| POST | /api/attendance/checkout | logged in | check out for today |
| GET | /api/attendance/today | logged in | my record for today |
| GET | /api/attendance/mine | logged in | my last 30 records |
| GET | /api/attendance?date= | admin | everyone's records for a date |
| POST | /api/leaves | logged in | apply for leave |
| GET | /api/leaves/mine | logged in | my leave requests |
| GET | /api/leaves | admin | all leave requests |
| PATCH | /api/leaves/:id | admin | approve or reject |

## Folder structure

```
staffsync/
├── server/
│   ├── models/       User, Attendance, Leave
│   ├── routes/       auth, employees, attendance, leaves
│   ├── middleware/   JWT check and admin check
│   ├── index.js      server entry point
│   └── seed.js       sample data and admin account
└── client/
    └── src/
        ├── pages/    Login, Dashboard, Employees, Attendance, Leaves
        ├── App.jsx   sidebar layout and routes
        └── api.js    helper for calling the backend
```

## Things that can be added

- Payroll and salary slips
- Leave balance per employee
- Password change and reset
- Search and filters on the employee list
- Monthly attendance report export
- Deploying it online

## Notes

An AI assistant (Claude) was used to help generate the initial code and explain how it works.
