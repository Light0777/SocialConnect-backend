const express = require("express");
const Post = require("../models/post");
const router = express.Router();

// ------------------- Create Post -------------------
router.post("/", async (req, res) => {
  try {
    const { title, description, userId, profileImg, bgImage, links, social } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({ error: "Title, description, and userId are required" });
    }

    const newPost = await Post.create({
      title,
      description,
      userId,
      image: profileImg || null, // profile image as post image
      bgImage: bgImage || null,
      links: links || [],
      social: social || [],
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
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
