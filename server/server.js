require("dotenv").config();

console.log("Loaded Clerk Keys?", {
  secret: process.env.CLERK_SECRET_KEY ? "YES" : "NO",
  publishable: process.env.CLERK_PUBLISHABLE_KEY ? "YES" : "NO"
});

const { Clerk } = require("@clerk/clerk-sdk-node");
Clerk({ secretKey: process.env.CLERK_SECRET_KEY }); // Add this ✅

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const usersRoute = require('./routes/users');
const postRoutes = require("./routes/posts");
const { User, Tenant } = require('./associations');
const sequelize = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Public Debug Routes
app.get("/test", (req, res) => {
  res.send("Express is working!");
});

app.get("/ping", (req, res) => {
  res.json({ message: "Backend is working ✅" });
});

// Debug logs for all requests
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// ✅ Protected API routes (Clerk Auth)
app.use("/api/users", ClerkExpressWithAuth(), usersRoute);
app.use("/posts", ClerkExpressWithAuth(), postRoutes);

// MySQL Database connection + Server start
sequelize.authenticate()
  .then(() => console.log('✅ MySQL connection successful'))
  .catch(err => console.error('❌ Unable to connect to MySQL:', err));

sequelize.sync({ force: false })
  .then(() => {
    console.log("✅ Database synced");
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch(err => console.error("❌ DB sync error:", err));


  
  
    // for development use this code block this will delete the data when you restart the server
  
  // // Sync only once, force=false to avoid foreign key conflicts
  // sequelize.sync({ force: true }) // ⚠ force: true will drop tables, good for dev
  //   .then(() => {
  //     console.log("✅ Database synced");
  //     app.listen(port, () => {
  //       console.log(`Server running on port ${port}`);
  //     });
  //   })
  //   .catch(err => console.error("❌ DB sync error:", err));
  
  // Sync tables without dropping them
  
  //  for production use this!