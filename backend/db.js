const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://landsdevelop_db:6QcD1L9CQ4iwOOuK@cluster0.zo75qcs.mongodb.net/findland?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
