// const express = require('express');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');

// const { getSecret } = require('./secrets');
// const usersRoute = require('./routes/users');

// // ✅ MySQL connection + models
// const sequelize = require('./db');
// const User = require('./models/user');
// const Session = require('./models/session');

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cookieParser());

// // Routes
// app.use('/api/users', usersRoute);

// sequelize.authenticate()
//   .then(() => console.log('✅ MySQL connection successful'))
//   .catch(err => console.error('❌ Unable to connect to MySQL:', err));


// // ✅ Sync MySQL tables at startup
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log("✅ Database synced");
//     // Start server only after DB sync
//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.error("❌ DB sync error:", err);
//   });

// module.exports = { app };


const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const usersRoute = require('./routes/users');
const postRoutes = require("./routes/posts");
const { User, Tenant } = require('./associations');
const sequelize = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// -------------------- Middleware --------------------
app.use(express.json()); // handles JSON body
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- Routes --------------------
app.use("/api/users", usersRoute);
app.use("/posts", postRoutes);

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/test", (req, res) => {
  res.send("Express is working!");
});

// -------------------- Start server --------------------
sequelize.authenticate()
  .then(() => console.log('✅ MySQL connection successful'))
  .catch(err => console.error('❌ Unable to connect to MySQL:', err));

sequelize.sync({ force: false })
  .then(() => {
    console.log("✅ Database synced");
    app.listen(port, '0.0.0.0', () => { // 0.0.0.0 allows external access
      console.log(`Server running on port ${port}`);
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