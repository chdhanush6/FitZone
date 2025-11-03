# FitZone Admin Panel Setup Guide

## Overview
The admin panel allows administrators to manage gym memberships, approve/reject applications, and view member statistics.

## Features
- 🔐 Secure admin login with JWT authentication
- 📊 Dashboard with membership statistics
- ✅ Approve pending membership applications
- 📝 View all members (pending, active, expired)
- 🔄 Change membership status (pending → active → expired)
- 🗑️ Delete memberships
- 📱 Responsive design

## Setup Instructions

### 1. Backend Setup

#### Create Initial Admin User
Run this command **once** to create the first admin account:

```bash
cd backend
node setup-admin.js
```

This will create an admin user with:
- **Username:** admin
- **Password:** admin123
- **Email:** admin@fitzone.com

⚠️ **IMPORTANT:** Change the password after first login!

#### Alternative: Create Admin via API
You can also create an admin using the API endpoint:

```bash
curl -X POST http://localhost:5001/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@fitzone.com",
    "password": "admin123"
  }'
```

### 2. Start the Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5001`

### 3. Start the Frontend

```bash
cd fitzone-react-app
npm start
```

The frontend will run on `http://localhost:3000`

## Accessing the Admin Panel

### Local Development
Navigate to: **http://localhost:3000/admin**

### Production
Navigate to: **https://your-domain.com/admin**

## Admin Panel Features

### Login Page
- Secure authentication with JWT tokens
- Session persistence (stays logged in after page refresh)

### Dashboard
1. **Statistics Cards**
   - Total members count
   - Pending applications count
   - Active members count
   - Expired members count

2. **Filter Tabs**
   - All Members
   - Pending (new registrations)
   - Active
   - Expired

3. **Membership Management**
   - View all membership details
   - Approve pending applications
   - Mark memberships as expired
   - Reactivate expired memberships
   - Delete memberships

## API Endpoints

### Admin Authentication
```
POST /api/admin/login
POST /api/admin/create
```

### Membership Management (Protected)
```
GET  /api/admin/memberships          # Get all memberships
GET  /api/admin/memberships?status=pending  # Filter by status
GET  /api/admin/stats                # Get statistics
PATCH /api/admin/memberships/:id/status     # Update status
DELETE /api/admin/memberships/:id    # Delete membership
```

## Security Notes

1. **JWT Authentication:** All admin endpoints (except login and create) require a valid JWT token in the Authorization header.

2. **Token Format:** 
   ```
   Authorization: Bearer <your-jwt-token>
   ```

3. **Token Expiry:** Tokens expire after 24 hours. Admin will need to login again.

4. **Change Default Password:** After first login, it's recommended to change the default admin password.

## Environment Variables

Make sure your `.env` file has:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/fitzone
JWT_SECRET=your-secret-key-change-this
```

## Troubleshooting

### Admin can't login
1. Make sure the backend server is running
2. Check if admin user exists in database
3. Verify MongoDB connection
4. Check browser console for errors

### "Invalid token" error
1. Token might be expired - login again
2. Check if JWT_SECRET is set in .env file
3. Clear browser localStorage and login again

### Memberships not loading
1. Check backend server logs
2. Verify MongoDB connection
3. Check browser network tab for failed requests

## User Workflow

### For New Member Registration
1. User fills registration form on main website
2. Membership is created with status "pending"
3. Admin logs into admin panel
4. Admin sees new registration in "Pending" tab
5. Admin reviews application and clicks "Approve"
6. Membership status changes to "active"
7. Member can now access gym services

## File Structure

```
backend/
├── models/
│   ├── admin.model.js          # Admin user schema
│   └── membership.model.js     # Membership schema
├── controllers/
│   ├── admin.controller.js     # Admin logic
│   └── membership.controller.js
├── routes/
│   ├── admin.routes.js         # Admin endpoints
│   └── membership.routes.js
├── middleware/
│   └── auth.middleware.js      # JWT verification
├── setup-admin.js              # Admin creation script
└── server.js                   # Main server file

fitzone-react-app/src/
├── AdminApp.js                 # Admin app wrapper
├── AdminLogin.js               # Admin login page
├── AdminLogin.css
├── AdminDashboard.js           # Admin dashboard
├── AdminDashboard.css
├── App.js                      # Main website
└── index.js                    # Router
```

## Additional Features (Future Enhancement)

- Password change functionality
- Multiple admin users
- Email notifications on approval/rejection
- Member search and filtering
- Export member data to CSV
- Activity logs

## Support

For issues or questions, please check:
1. Backend logs: `backend/` console
2. Frontend logs: Browser Developer Console
3. MongoDB logs: MongoDB Compass or CLI

---

**Note:** This admin panel is designed to work alongside your existing FitZone application without affecting its functionality.
