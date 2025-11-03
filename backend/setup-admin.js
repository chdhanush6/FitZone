// Setup script to create initial admin user
// Run this once: node backend/setup-admin.js

const mongoose = require('mongoose');
const Admin = require('./models/admin.model');
const dotenv = require('dotenv');

dotenv.config();

const createInitialAdmin = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitzone';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Username: admin');
      process.exit(0);
    }

    // Create admin user
    const admin = new Admin({
      username: 'admin',
      email: 'admin@fitzone.com',
      password: 'admin123' // Change this password!
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('==========================================');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@fitzone.com');
    console.log('==========================================');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    console.log('You can access the admin panel at: http://localhost:3000/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createInitialAdmin();
