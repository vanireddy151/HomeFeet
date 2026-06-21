// Run on Render's Shell tab: node scripts/grant-admin.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const TARGETS = [
  { email: 'vanikalavala@inventorheads.com', firstName: 'Vani', lastName: 'Kalavala' },
  { email: 'ashokreddy@inventorheads.com', firstName: 'Ashok', lastName: 'Reddy' }
];
const NEW_PASSWORD = 'HomeFeet@2026';

const run = async () => {
  await mongoose.connect(
    'mongodb+srv://HomeFeet_db:J7N6VOFOspRrcBEL@cluster0.ztld8k3.mongodb.net/homefeet?retryWrites=true&w=majority&appName=Cluster0'
  );

  const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);

  for (const target of TARGETS) {
    const email = target.email.toLowerCase();
    let user = await User.findOne({ email });

    if (user) {
      user.accountType = 'admin';
      user.password = passwordHash;
      user.isVerified = true;
      await user.save();
      console.log(`Updated existing user -> admin: ${email}`);
    } else {
      user = await User.create({
        email,
        password: passwordHash,
        firstName: target.firstName,
        lastName: target.lastName,
        accountType: 'admin',
        isVerified: true
      });
      console.log(`Created new admin user: ${email}`);
    }
  }

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((err) => {
  console.error('grant-admin script failed:', err);
  process.exit(1);
});
