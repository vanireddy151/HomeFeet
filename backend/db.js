const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://HomeFeet_db:NemqFslBLlie4dj6@cluster0.ztld8k3.mongodb.net/homefeet?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
