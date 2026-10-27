# 🎪 Event Registration Admin Panel (MERN Stack)

A complete, modern, and responsive **Event Registration Admin Panel** built with the **MERN Stack** (MongoDB Atlas, Express.js, React.js, Node.js) for managing events and registrations.

---

## 🌟 Features

- 📊 **Interactive Dashboard:**
  - 3 dynamic statistics cards: Total Events, Upcoming Events, and Total Registrations.
  - Real-time search filter by Event Name or Venue.
- 📋 **Events Management Table:**
  - Displays Event ID (MongoDB document ID badge), Event Name, Description preview, Event Date (with upcoming/past badge), Venue, Registrations, and Action buttons.
  - Friendly empty state when no events exist.
  - Loading spinner and error alerts with retry option.
- ➕ **Add Event Page:**
  - Dedicated route (`/add-event`) with full client-side & server-side validation.
  - Form fields: Event Name, Description, Date, Venue, and Registrations.
  - Toast notification and auto-redirection on success.
- ✏️ **Edit & Update Event:**
  - Dedicated route (`/edit-event/:id`) pre-populates existing data.
  - Updates record via `PUT /api/events/:id` without creating duplicates.
- 🗑️ **Delete Event with Confirmation Dialog:**
  - Modal confirmation dialog prevents accidental deletion.
  - Removes record from MongoDB and updates the UI instantly.
- 📱 **Responsive Design:**
  - Mobile hamburger navigation, responsive statistics cards, scrollable table on small screens, and polished UI with CSS variables.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| **Frontend** | React 18 (Vite), React Router DOM v6 |
| **Styling** | Modern CSS3 (CSS Variables, Flexbox, Grid, Animations) |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas via Mongoose ORM |
| **Environment** | dotenv |

---

## 📁 Project Structure

```
event-registration-admin/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation bar with responsive hamburger
│   │   │   └── EventTable.jsx     # Events table with delete confirmation modal
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Dashboard with stats cards and search
│   │   │   └── AddEvent.jsx       # Add / Edit Event form
│   │   ├── services/
│   │   │   └── api.js             # Axios API service
│   │   ├── App.jsx                # Route definitions
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Custom styling
│   ├── index.html                 # Vite HTML entry
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── models/
│   │   └── Event.js               # Mongoose schema and model
│   ├── routes/
│   │   └── eventRoutes.js         # REST API route handlers
│   ├── server.js                  # Express server & MongoDB connection
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- A free **MongoDB Atlas** account: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## 🗄️ MongoDB Atlas Setup (Step-by-Step)

1. **Log in / Sign up:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. **Create a Database Cluster:**
   - Choose the free **M0 Sandbox** cluster.
   - Select your preferred cloud provider and closest region.
   - Click **Create Deployment**.
3. **Set Up Database Access (User):**
   - In the left sidebar, click **Database Access** under *Security*.
   - Click **Add New Database User**.
   - Choose **Password** authentication.
   - Enter a username (e.g. `admin`) and a secure password (make note of this password!).
   - Set privileges to **Read and write to any database**.
   - Click **Add User**.
4. **Set Up Network Access (IP Whitelist):**
   - In the left sidebar, click **Network Access** under *Security*.
   - Click **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) for development.
   - Click **Confirm**.
5. **Get Your Connection String:**
   - Go to **Database** (or **Clusters**) in the left sidebar.
   - Click **Connect** next to your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection string. It will look similar to:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` with your database username and `<password>` with your database user password.
   - Add a database name before the `?` query parameters, e.g. `/eventdb`:
     ```
     mongodb+srv://admin:MyPassword123@cluster0.xxxxx.mongodb.net/eventdb?retryWrites=true&w=majority
     ```

---

## 🔐 Environment Variables Configuration

### 1. Backend `.env`
Inside the `backend/` folder, copy `.env.example` to `.env`:
```powershell
cd backend
Copy-Item .env.example .env
```
Open `backend/.env` in your text editor and set your connection string:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/eventdb?retryWrites=true&w=majority
PORT=5000
```

### 2. Frontend `.env`
Inside the `frontend/` folder, copy `.env.example` to `.env`:
```powershell
cd ../frontend
Copy-Item .env.example .env
```
`frontend/.env` contains:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 How to Run the Application (Windows)

### Step 1: Start the Backend Server
Open a terminal in the project directory:
```powershell
cd backend
npm install
npm run dev
```
You should see:
```
✅ Connected to MongoDB Atlas successfully
🚀 Server running on http://localhost:5000
```

### Step 2: Start the Frontend Application
Open a **second terminal**:
```powershell
cd frontend
npm install
npm run dev
```
You will see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```
Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 📡 REST API Endpoints

Base URL: `http://localhost:5000/api/events`

| Method | Endpoint | Description | Request Body (JSON) | Status Codes |
|---|---|---|---|---|
| `GET` | `/api/events` | Retrieve all events | None | `200`, `500` |
| `GET` | `/api/events/:id` | Retrieve single event by ID | None | `200`, `400`, `404`, `500` |
| `POST` | `/api/events` | Create a new event | `eventName`, `eventDescription`, `eventDate`, `venue`, `totalRegistrations` | `201`, `400`, `500` |
| `PUT` | `/api/events/:id` | Update an existing event | `eventName`, `eventDescription`, `eventDate`, `venue`, `totalRegistrations` | `200`, `400`, `404`, `500` |
| `DELETE` | `/api/events/:id` | Delete an event | None | `200`, `400`, `404`, `500` |

### Sample JSON Request Body (POST / PUT):
```json
{
  "eventName": "Tech Summit 2026",
  "eventDescription": "Annual national conference on full-stack development and cloud computing.",
  "eventDate": "2026-11-20",
  "venue": "Convention Centre, Hall A",
  "totalRegistrations": 150
}
```

---

## 🏗️ Production Build

To test building the frontend for production:
```powershell
cd frontend
npm run build
```
The optimized production output will be generated in `frontend/dist/`.

---

## 📤 Pushing to GitHub

1. Ensure `.env` files are ignored (they are already included in `.gitignore`).
2. Run the following commands in the root `event-registration-admin/` folder:
```powershell
git init
git add .
git commit -m "Complete MERN Stack Event Registration Admin Panel"
```
3. Create a new repository on [GitHub](https://github.com/new).
4. Link and push your code:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```
