import mongoose from "mongoose";
import PostMessage from "../Models/postMessage.js";

// GET all posts
export const getPosts = async (req, res) => {
  try {
    const postMessage = await PostMessage.find();
    res.status(200).json(postMessage);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// CREATE post
export const createPost = async (req, res) => {
  const post = req.body;

  try {
    // Log incoming request
    console.log("Incoming createPost request body:", post);

    //  Validate required fields before saving
    if ( !post.title || !post.message) {
      return res.status(400).json({ message: "Creator, title, and message are required!" });
    }

    // Ensure tags is an array
    if (!Array.isArray(post.tags)) post.tags = [];

    // Ensure selectedFile exists
    if (!post.selectedFile) post.selectedFile = "";

    const newPost = new PostMessage({...post,creator:req.userId,createdAt:new Date().toISOString()});
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE post
export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  res.json(updatedPost);
};

// DELETE post
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  try {
    const deletedPost = await PostMessage.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully!" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: error.message });
  }
};

//Like post
export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: "Unauthenticated" });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    try {
        const post = await PostMessage.findById(id);

        // ✅ FIX: Use 'likeCount' because that is what is in your Database
        if (!post.likeCount) post.likeCount = [];

        const index = post.likeCount.findIndex((id) => id === String(req.userId));

        if (index === -1) {
            // Like the post
            post.likeCount.push(req.userId);
        } else {
            // Dislike the post
            post.likeCount = post.likeCount.filter((id) => id !== String(req.userId));
        }

        // ✅ FIX: Update 'likeCount' in the database
        const updatedPost = await PostMessage.findByIdAndUpdate(
            id, 
            { likeCount: post.likeCount }, // Update the correct field name
            { new: true }
        );
        
        res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}




