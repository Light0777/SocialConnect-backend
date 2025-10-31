const User = require("../models/user");
const express = require("express");
const Post = require("../models/post");
const router = express.Router();

// ------------------- Create Post -------------------
router.post("/", async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({ error: "Title, description, and userId are required" });
    }

    // Fetch the user's current profile data
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use user’s current data for post fields
    const newPost = await Post.create({
      title,
      description,
      userId,
      image: user.profileImg || null,
      bgImage: user.bgImage || null,
      links: user.links || [],
      social: user.social || [],
      userName: user.username || "Anonymous",
      bio: user.bio || "",
      bgColor: user.bgColor || "#ffffff",
    });

    res.status(201).json({ post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ------------------- Get all posts -------------------
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "profileImg", "bio", "bgImage", "links", "social", "bgColor"],
        },
      ],
    });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
