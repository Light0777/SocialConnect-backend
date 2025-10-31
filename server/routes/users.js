// // new update
// const express = require('express');
// const bcrypt = require('bcrypt');
// const User = require('../models/user');
// const Tenant = require('../models/tenant');
// const multer = require('multer');
// const path = require('path');

// const router = express.Router();

// // Default tenant ID
// const DEFAULT_TENANT = 'tenant_1';

// // ------------------- Multer Setup -------------------
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
// });

// const upload = multer({ storage });

// // Serve uploaded files
// router.use('/uploads', express.static('uploads'));

// // ------------------- UPLOAD PROFILE IMAGE -------------------
// router.post('/upload', upload.single('image'), (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//     // Use server IP or hostname + port
//     const imageUrl = `http://10.134.54.91:3000/uploads/${req.file.filename}`;
//     res.json({ url: imageUrl });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'File upload failed' });
//   }
// });


// // ------------------- SIGNUP -------------------
// router.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Find or create default tenant
//     let tenant = await Tenant.findOne({ where: { name: DEFAULT_TENANT } });
//     if (!tenant) {
//       tenant = await Tenant.create({ name: DEFAULT_TENANT });
//     }

//     // Check if user already exists under this tenant
//     const existingUser = await User.findOne({ where: { email, tenantId: tenant.id } });
//     if (existingUser) return res.status(400).json({ error: 'User already exists' });

//     // HASH PASSWORD
//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await User.create({ username, email, password: hashedPassword, tenantId: tenant.id });

//     res.json({ message: 'User registered successfully', user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ------------------- LOGIN -------------------
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password required' });
//     }

//     // Find default tenant
//     const tenant = await Tenant.findOne({ where: { name: DEFAULT_TENANT } });
//     if (!tenant) return res.status(400).json({ error: 'Tenant not found' });

//     const user = await User.findOne({ where: { email, tenantId: tenant.id } });
//     if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ error: 'Invalid credentials' });

//     // Token generation placeholder
//     const token = 'dummy-token'; // Replace with real JWT later

//     // ✅ Send cleaned, parsed user object
//     res.json({
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         bio: user.bio || '',
//         profileImg: user.profileImg || 'https://via.placeholder.com/120',
//         bgColor: user.bgColor || '#989a9c',
//         bgImage: user.bgImage || null,
//         links: Array.isArray(user.links) ? user.links : JSON.parse(user.links || '[]'),
//         social: Array.isArray(user.social) ? user.social : JSON.parse(user.social || '[]'),
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// // ------------------- UPDATE PROFILE -------------------
// router.put('/update', async (req, res) => {
//   try {
//     const { userId, name, bio, profileImg, links, social, bgColor, bgImage } = req.body;

//     if (!userId) return res.status(400).json({ error: 'User ID is required' });

//     const user = await User.findByPk(userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     // Only overwrite if value is explicitly provided
//     if (name !== undefined) user.username = name;
//     if (bio !== undefined) user.bio = bio;
//     if (profileImg && profileImg.trim() !== "") user.profileImg = profileImg;
//     if (bgImage && bgImage.trim() !== "") user.bgImage = bgImage;
//     if (bgColor !== undefined) user.bgColor = bgColor;

//     // Safely handle array fields
//     if (links !== undefined) user.links = Array.isArray(links) ? links : JSON.parse(links || '[]');
//     if (social !== undefined) user.social = Array.isArray(social) ? social : JSON.parse(social || '[]');



//     await user.save();

//     res.json({
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         bio: user.bio || '',
//         profileImg: user.profileImg || 'https://via.placeholder.com/120',
//         bgColor: user.bgColor || '#989a9c',
//         bgImage: user.bgImage || null,
//         links: user.links || [],
//         social: user.social || [],
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// // ------------------- UPLOAD PROFILE IMAGE -------------------
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     res.json({
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         bio: user.bio || '',
//         profileImg: user.profileImg || 'https://via.placeholder.com/120',
//         bgColor: user.bgColor || '#989a9c',
//         bgImage: user.bgImage || null,
//         links: Array.isArray(user.links) ? user.links : JSON.parse(user.links || '[]'),
//         social: Array.isArray(user.social) ? user.social : JSON.parse(user.social || '[]'),
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });




// module.exports = router;


// routes/users.js
// const express = require('express');
// const bcrypt = require('bcrypt');
// const validator = require('validator');
// const path = require('path');
// const multer = require('multer');
// const dns = require('dns').promises;
// const disposableDomains = require('disposable-email-domains');

// const User = require('../models/user');
// const Tenant = require('../models/tenant');

// const router = express.Router();
// const DEFAULT_TENANT = 'tenant_1';

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
// });
// const upload = multer({ storage });

// // Upload endpoint
// router.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
//   const imageUrl = `http://10.134.54.91:3000/uploads/${req.file.filename}`;
//   return res.status(200).json({ url: imageUrl });
// });

// // Helper: normalize & get domain
// function normalizeEmail(email) {
//   return (email || '').trim().toLowerCase();
// }

// // Helper: check disposable domain list (exact match)
// function isDisposableDomain(domain) {
//   if (!domain) return false;
//   return disposableDomains.includes(domain);
// }

// // Helper: check MX (with fallback to A record)
// async function domainHasMailExchanger(domain) {
//   try {
//     const mx = await dns.resolveMx(domain);
//     if (Array.isArray(mx) && mx.length > 0) return true;
//   } catch (mxErr) {
//     // MX lookup failed — try A lookup as a fallback (some domains rely on A)
//     try {
//       const a = await dns.resolve(domain);
//       if (Array.isArray(a) && a.length > 0) return true;
//     } catch (aErr) {
//       return false;
//     }
//   }
//   return false;
// }

// // Register
// router.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Basic presence checks
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     const normalizedEmail = normalizeEmail(email);
//     console.log('[REGISTER] incoming email:', email, 'normalized:', normalizedEmail);

//     // Syntax check
//     if (!validator.isEmail(normalizedEmail)) {
//       console.log('[REGISTER] invalid syntax:', normalizedEmail);
//       return res.status(400).json({ error: 'Invalid email address' });
//     }

//     // domain extraction
//     const domain = normalizedEmail.split('@')[1];
//     if (!domain) {
//       console.log('[REGISTER] could not extract domain:', normalizedEmail);
//       return res.status(400).json({ error: 'Invalid email address' });
//     }

//     // Disposable domain check
//     const disposable = isDisposableDomain(domain);
//     console.log('[REGISTER] domain:', domain, 'disposable:', disposable);
//     if (disposable) {
//       return res.status(400).json({ error: 'Disposable emails are no                                                                                                                                                                                                                                                                                                                                                                                                        t allowed' });
//     }

//     // MX/A record existence check
//     const hasMail = await domainHasMailExchanger(domain);
//     console.log('[REGISTER] domain:', domain, 'hasMail:', hasMail);
//     if (!hasMail) {
//       return res.status(400).json({ error: 'Email domain is not valid or does not accept mail' });
//     }

//     // Password length
//     if (password.length < 6) {
//       return res.status(400).json({ error: 'Password must be at least 6 characters' });
//     }

//     // Tenant handling
//     let tenant = await Tenant.findOne({ where: { name: DEFAULT_TENANT } });
//     if (!tenant) {
//       tenant = await Tenant.create({ name: DEFAULT_TENANT });
//       console.log('[REGISTER] created default tenant id:', tenant.id);
//     }

//     // Ensure we check normalized email in DB (prevent case duplicates)
//     const existingUser = await User.findOne({ where: { email: normalizedEmail, tenantId: tenant.id } });
//     if (existingUser) {
//       console.log('[REGISTER] user already exists:', normalizedEmail);
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     // Hash & create
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const user = await User.create({
//       username,
//       email: normalizedEmail,
//       password: hashedPassword,
//       tenantId: tenant.id,
//     });

//     console.log('[REGISTER] user created id:', user.id, 'email:', user.email);
//     return res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username: user.username, email: user.email } });
//   } catch (err) {
//     console.error('[REGISTER] error:', err && err.message ? err.message : err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// // Login (keeps simple validation)
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

//     const normalizedEmail = normalizeEmail(email);
//     if (!validator.isEmail(normalizedEmail)) return res.status(400).json({ error: 'Invalid email format' });

//     const tenant = await Tenant.findOne({ where: { name: DEFAULT_TENANT } });
//     if (!tenant) return res.status(400).json({ error: 'Tenant not found' });

//     const user = await User.findOne({ where: { email: normalizedEmail, tenantId: tenant.id } });
//     if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//     const matched = await bcrypt.compare(password, user.password);
//     if (!matched) return res.status(401).json({ error: 'Invalid credentials' });

//     const token = 'dummy-token';
//     return res.status(200).json({
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         bio: user.bio || '',
//         profileImg: user.profileImg || 'https://via.placeholder.com/120',
//         bgColor: user.bgColor || '#989a9c',
//         bgImage: user.bgImage || null,
//         links: Array.isArray(user.links) ? user.links : JSON.parse(user.links || '[]'),
//         social: Array.isArray(user.social) ? user.social : JSON.parse(user.social || '[]')
//       }
//     });
//   } catch (err) {
//     console.error('[LOGIN] error:', err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// });

// // Update and get routes unchanged (kept minimal)
// router.put('/update', async (req, res) => {
//   try {
//     const { userId, name, bio, profileImg, links, social, bgColor, bgImage } = req.body;
//     if (!userId) return res.status(400).json({ error: 'User ID is required' });
//     const user = await User.findByPk(userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     if (name !== undefined) user.username = name;
//     if (bio !== undefined) user.bio = bio;
//     if (profileImg?.trim()) user.profileImg = profileImg;
//     if (bgImage?.trim()) user.bgImage = bgImage;
//     if (bgColor !== undefined) user.bgColor = bgColor;
//     if (links !== undefined) user.links = Array.isArray(links) ? links : JSON.parse(links || '[]');
//     if (social !== undefined) user.social = Array.isArray(social) ? social : JSON.parse(social || '[]');
//     await user.save();
//     return res.status(200).json({ user });
//   } catch (err) {
//     console.error('[UPDATE] error:', err);
//     return res.status(500).json({ error: 'Server error during update' });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     return res.status(200).json({ user });
//   } catch (err) {
//     console.error('[GET] error:', err);
//     return res.status(500).json({ error: 'Server error while fetching user' });
//   }
// });

// module.exports = router;


const express = require("express");
const multer = require("multer");
const router = express.Router();
const { User } = require("../associations");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`)
});
const upload = multer({ storage });

// ✅ Upload image (auth already handled in server.js)
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// ✅ Get logged-in user profile
router.get("/profile", async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

    let user = await User.findOne({ where: { clerkId } });

    if (!user) {
      user = await User.create({
        clerkId,
        username: "",
        bio: "",
        profileImg: "",
        bgImage: "",
        bgColor: "#989a9c",
        links: [],
        social: []
      });
    }

    res.json({ user });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update profile
router.put("/profile", async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

    const profileData = req.body;

    console.log("Updating profile with:", profileData); // ✅ Add this log

    let user = await User.findOne({ where: { clerkId } });

    if (!user) {
      user = await User.create({ clerkId, ...profileData });
    } else {
      await user.update(profileData);
    }

    res.json({ user });
  } catch (err) {
    console.error("DB error:", err.message); // ✅ Add this log
    res.status(500).json({ error: "Failed to save profile" });
  }
});


// ✅ Public user profile
router.get("/:clerkId", async (req, res) => {
  try {
    const user = await User.findOne({
      where: { clerkId: req.params.clerkId }
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Public fetch error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;