const Posts = require("../Model/Posts");

// Fn for get api
const getPosts = async (req, res) => {
  try {
    const posts = await Posts.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// Fn for posts api
const createPost = async (req, res) => {
  try {
    console.log("creatin post....", req.body);
    const newPost = Posts.create(req.body);
    if (!newPost) throw Error("Something went wrong while saving the post");
    res.status(200).json(newPost);
  } catch (error) {
    res.status(400).json({ message: err });
  }
};

// Fn for delete api
const deleteById = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) throw Error("Something went wrong while deleting the post");
    const deletedPost = await Posts.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: err });
  }
};

// Fn for update
const updateById = async (req, res) => {
  console.log("req.params", req.params);
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) throw Error("Something went wrong while updating the post");
    const updatedPost = await Posts.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: err });
  }
};

// Fn for get by id
const getById = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) throw Error("no items");
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: err });
  }
};

module.exports = {
  getPosts,
  createPost,
  deleteById,
  updateById,
  getById,
};
