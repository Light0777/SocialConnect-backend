// const express = require('express');
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// // bcrypt.hash("123456789", 10).then(console.log);

// const User = require('../models/user');
// const Session = require('../models/session');

// const router = express.Router();

// // Test route
// router.get('/', (req, res) => {
//   res.json({ message: 'Users API is working!' });
// });

// // Register user
// router.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // ❌ no hashing here, hook will handle it
//     const user = await User.create({ username, email, password });

//     res.json({ message: 'User registered', userId: user.id });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });


// // Login user
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("Login attempt:", { email, password });

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password required' });
//     }

//     const user = await User.findOne({ where: { email } });
//     console.log("User found:", user ? user.toJSON() : null);

//     if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//     const match = await bcrypt.compare(password, user.password);
//     console.log("Password match:", match);

//     if (!match) return res.status(401).json({ error: 'Invalid credentials' });

//     // Create session with 24h expiry
//     const token = await Session.generateToken();
//     const csrfToken = await Session.generateToken(); // <-- generate csrfToken too
//     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

//     await Session.create({ token, csrfToken, UserId: user.id, expiresAt });


//     res.cookie('session', token, { httpOnly: true, expires: expiresAt });

//     // Return token + user info for React Native frontend
//     res.json({
//       message: 'Logged in',
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



// // Logout user
// router.post('/logout', async (req, res) => {
//   try {
//     const token = req.cookies.session;
//     if (token) await Session.destroy({ where: { token } });

//     res.clearCookie('session');
//     res.json({ message: 'Logged out' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Middleware to protect routes
// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies.session;
//     if (!token) return res.status(401).json({ error: 'Unauthorized' });

//     const session = await Session.findOne({ where: { token } });
//     if (!session || session.expiresAt < new Date()) return res.status(401).json({ error: 'Invalid or expired session' });

//     req.userId = session.UserId;
//     next();
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Protected route example
// router.get('/me', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findByPk(req.userId, { attributes: ['id', 'username', 'email'] });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;



// sudo systemctl stop mysql (stop mysql)


// new update
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Tenant = require('../models/tenant');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Default tenant ID
const DEFAULT_TENANT = 'tenant_1';

// ------------------- Multer Setup -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Serve uploaded files
router.use('/uploads', express.static('uploads'));

// ------------------- UPLOAD PROFILE IMAGE -------------------
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Use server IP or hostname + port
    const imageUrl = `http://10.134.54.91:3000/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File upload failed' });
  }
});


// ------------------- SIGNUP -------------------
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find or create default tenant
    let tenant = await Tenant.findOne({ where: { name: DEFAULT_TENANT } });
    if (!tenant) {
      tenant = await Tenant.create({ name: DEFAULT_TENANT });
    }

    // Check if user already exists under this tenant
    const existingUser = await User.findOne({ where: { email, tenantId: tenant.id } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ username, email, password: hashedPassword, tenantId: tenant.id });

    res.json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------- LOGIN -------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find default tenant
    const tenant = await Tenant.findOne({ where: { name: DEFAULT_TENANT } });
    if (!tenant) return res.status(400).json({ error: 'Tenant not found' });

    const user = await User.findOne({ where: { email, tenantId: tenant.id } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Token generation placeholder
    const token = 'dummy-token'; // Replace with real JWT later

    // ✅ Send cleaned, parsed user object
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        profileImg: user.profileImg || 'https://via.placeholder.com/120',
        bgColor: user.bgColor || '#989a9c',
        bgImage: user.bgImage || null,
        links: Array.isArray(user.links) ? user.links : JSON.parse(user.links || '[]'),
        social: Array.isArray(user.social) ? user.social : JSON.parse(user.social || '[]'),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ------------------- UPDATE PROFILE -------------------
router.put('/update', async (req, res) => {
  try {
    const { userId, name, bio, profileImg, links, social, bgColor, bgImage } = req.body;

    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Only overwrite if value is explicitly provided
    if (name !== undefined) user.username = name;
    if (bio !== undefined) user.bio = bio;
    if (profileImg && profileImg.trim() !== "") user.profileImg = profileImg;
    if (bgImage && bgImage.trim() !== "") user.bgImage = bgImage;
    if (bgColor !== undefined) user.bgColor = bgColor;

    // Safely handle array fields
    if (links !== undefined) user.links = Array.isArray(links) ? links : JSON.parse(links || '[]');
    if (social !== undefined) user.social = Array.isArray(social) ? social : JSON.parse(social || '[]');



    await user.save();

    res.json({
      // message: 'Profile updated',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        profileImg: user.profileImg || 'https://via.placeholder.com/120',
        bgColor: user.bgColor || '#989a9c',
        bgImage: user.bgImage || null,
        links: user.links || [],
        social: user.social || [],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ------------------- UPLOAD PROFILE IMAGE -------------------
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio || '',
        profileImg: user.profileImg || 'https://via.placeholder.com/120',
        bgColor: user.bgColor || '#989a9c',
        bgImage: user.bgImage || null,
        links: Array.isArray(user.links) ? user.links : JSON.parse(user.links || '[]'),
        social: Array.isArray(user.social) ? user.social : JSON.parse(user.social || '[]'),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;
