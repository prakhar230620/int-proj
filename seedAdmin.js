const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('config');
const User = require('./server/models/User');

mongoose.connect(config.get('mongoURI'))
  .then(async () => {
    console.log('MongoDB Connected');
    try {
      // Check if admin already exists
      let admin = await User.findOne({ email: 'toolminesai@gmail.com' });
      if (admin) {
        // Update admin privileges if not already admin
        if (!admin.isAdmin) {
          admin.isAdmin = true;
          await admin.save();
          console.log('Admin privileges updated for existing user');
        } else {
          console.log('Admin user already exists with admin privileges');
        }
      } else {
        // Create new admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('pb82.207', salt);
        admin = new User({
          name: 'Admin User',
          email: 'toolminesai@gmail.com',
          password: hashedPassword,
          isAdmin: true,
          bio: 'System Administrator',
          profilePicture: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
        });
        await admin.save();
        console.log('Admin user created successfully');
      }
      mongoose.disconnect();
      console.log('MongoDB Disconnected');
    } catch (err) {
      console.error('Error:', err.message);
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
  });