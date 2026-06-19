const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://HomeFeet_db:GemdVJ1n3SH8CZOl@cluster0.ztld8k3.mongodb.net/findland?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
