# UniMate

A web app that helps university students manage their coursework in one place: assignments, deadlines, notes, subjects and study time. The dashboard works out **what to work on first**, so students don't have to guess.

## Features

- Register and log in (passwords are hashed, login uses a token)
- Add, edit, delete and complete assignments, each with a due date, priority and optional subject
- **Work on this first**: a dashboard list that ranks pending assignments by priority and deadline
- Progress chart showing completed and pending assignments
- Overdue assignments are flagged
- Subjects (modules) to organize assignments, notes and study sessions
- Notes organized by subject, with a subject filter
- Monthly calendar showing assignment due dates, colored by priority
- Study sessions with planned and completed time, and a total of time studied
- Every student only sees their own data

## Login
<img width="1043" height="549" alt="image" src="https://github.com/user-attachments/assets/1b423a51-2d96-41d1-ab62-0614c67efb04" />

## Screenshots 
## Manage assignments
<img width="1895" height="859" alt="image" src="https://github.com/user-attachments/assets/12f99997-d09b-4ee6-8eb4-9a4637ccf821" />
## Add notes
<img width="1867" height="885" alt="image" src="https://github.com/user-attachments/assets/af8611bb-2477-4f4a-9ef1-3df865f791d4" />




## How the priority ranking works

Each pending assignment gets a score, and a higher score means "do this first":

```
score = priority weight / days left
```

The weights are high = 3, medium = 2 and low = 1. The days left have a minimum of 0.5, so overdue work ranks highest.

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB (MongoDB Atlas) with Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |

## Project structure

```
unimate/
├── client/               React app
│   └── src/
│       ├── api/          Axios setup
│       ├── components/   Navbar, forms, chart, priority list
│       └── pages/        Login, Register, Dashboard, Notes, Calendar, Study
└── server/               Express API
    ├── middleware/       Token check
    ├── models/           User, Assignment, Subject, Note, StudySession
    ├── routes/           auth, assignments, subjects, notes, sessions
    └── utils/            Helper functions
```

## Getting started

### What you need

- Node.js (LTS version)
- A MongoDB database. A free MongoDB Atlas cluster works well.

### 1. Clone the project

```bash
git clone https://github.com/MethukiDesilva/unimate-app.git
cd unimate-app
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a file named `.env` inside `server` with these values:

```
MONGO_URI=your MongoDB connection string, ending in /unimate
PORT=5000
JWT_SECRET=a long random string
```

Start the server:

```bash
npm run dev
```

You should see `Connected to MongoDB` and `Server running on port 5000`.

### 3. Set up the client

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the link it prints (usually http://localhost:5173).

## Environment variables

| Variable | Where | What it does |
|---|---|---|
| `MONGO_URI` | server | Connection string for the database |
| `PORT` | server | Port the API listens on |
| `JWT_SECRET` | server | Secret used to sign login tokens |
| `CLIENT_URL` | server (optional) | Website address allowed to call the API |
| `VITE_API_URL` | client (optional) | Address of the API, for example `https://your-api.example.com/api` |

Never commit the `.env` file.

## API overview

All routes except register and login need the header `Authorization: Bearer <token>`.

| Method | Route | What it does |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in and get a token |
| GET, POST | `/api/assignments` | List or add assignments |
| PUT, DELETE | `/api/assignments/:id` | Edit or delete an assignment |
| GET, POST | `/api/subjects` | List or add subjects |
| DELETE | `/api/subjects/:id` | Delete a subject |
| GET, POST | `/api/notes` | List notes (optional `?subject=ID`) or add one |
| PUT, DELETE | `/api/notes/:id` | Edit or delete a note |
| GET, POST | `/api/sessions` | List or add study sessions |
| PUT, DELETE | `/api/sessions/:id` | Edit or delete a study session |

## Roadmap

- Deploy the app online
- File attachments for notes

## Author

Built by Methuki Desilva as a learning project while studying the MERN stack.
