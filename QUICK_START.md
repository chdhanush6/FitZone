# Quick Start Guide - Admin Panel

## Step-by-Step Setup

### 1. Create Admin User

Open a terminal in the `backend` folder and run:

**For Windows (PowerShell):**
```powershell
cd backend
node setup-admin.js
```

**For Mac/Linux:**
```bash
cd backend
node setup-admin.js
```

This creates:
- Username: `admin`
- Password: `admin123`
- Email: `admin@fitzone.com`

### 2. Start Backend Server

In the `backend` folder:
```bash
npm start
```

Server runs on: http://localhost:5001

### 3. Start Frontend

In the `fitzone-react-app` folder:
```bash
npm start
```

App runs on: http://localhost:3000

### 4. Access Admin Panel

Open your browser and go to:
```
http://localhost:3000/admin
```

Login with:
- Username: `admin`
- Password: `admin123`

## What You Can Do

✅ View all membership applications
✅ Approve pending registrations (change status from "pending" to "active")
✅ See statistics (total, pending, active, expired members)
✅ Mark memberships as expired
✅ Reactivate expired memberships
✅ Delete memberships

## Important URLs

- **Main Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Backend API:** http://localhost:5001

## Troubleshooting

**Q: Can't create admin user?**
- Make sure MongoDB is running
- Check if backend dependencies are installed (`npm install` in backend folder)

**Q: Can't login to admin panel?**
- Make sure backend server is running on port 5001
- Check browser console for errors
- Verify admin user was created successfully

**Q: Backend not connecting?**
- Update `BACKEND_URL` in AdminLogin.js and AdminDashboard.js if needed
- Current default: https://fitzone-1-bny6.onrender.com

## Security Note

⚠️ **Change the default password** after your first login!

---

Your existing FitZone application will continue to work normally. The admin panel is a separate interface accessible at `/admin`.
