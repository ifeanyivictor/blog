import express from "express";
import expressAsyncHandler from "express-async-handler";
import Blog from "../models/blogModel.js";
import { isAuth } from "../utils.js";

const blogRouter = express.Router();

blogRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const catName = req.query.category;
    try {
      let blogs;
      if (catName) {
        blogs = await Blog.find({
          category: { $in: [catName] },
          isApprove: true,
        })
          .sort({ createdAt: -1 })
      } else {
        blogs = await Blog.find({ isApprove: true })
          .sort({ createdAt: -1 })
      }
      res.status(200).json(blogs);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);


blogRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const catName = req.query.category;
    try {
      let categories;
      if (catName) {
        categories = await Blog.find().distinct("category")
      } else {
        categories = await Blog.find().distinct("category");
      }
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);


// .sort({createdAt: -1}) is use to sort new posts

blogRouter.get(
  "/recent-blogs",
  expressAsyncHandler(async (req, res) => {
    const recentBlog = await Blog.find({ isApprove: true })
      .sort({ createdAt: -1 })
      .limit(2);
    res.send(recentBlog);
  })
);

blogRouter.get(
  "/all-blogs",
  expressAsyncHandler(async (req, res) => {
    // FILTERING SELLERS
    const blogs = await Blog.find({ isApprove: true })
      .sort({ createdAt: -1 })
    res.send(blogs);
  })
);

blogRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    // FILTERING SELLERS

    const category = req.query.category || "";
    const categoryFilter = category ? { category } : {};
    const blogs = await Blog.find({
      ...categoryFilter,
      isApprove: true,
    })
      .sort({ createdAt: -1 })
    res.send(blogs);
  })
);

// Get all post

blogRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const blogs = await Blog.findById(req.params.id);
    if (blogs) {
      res.send(blogs);
    } else {
      res.status(404).send({ message: "Post Not Found" });
    }
  })
);


blogRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const blogs = new Blog({
      title: "sample name" + Date.now(),
      highlight: "We are moving with the best news",
      photo: "/images/watch.jpeg",
      category: "enter category",
      rating: 0,
      nun_reviews: 0,
      desc: "write description",
      tag: ["Phone", "iPhone", "Accessories", "Computer"],
      isApprove: false,
      isRejected: false,
      reason: "Enter reason for rejection",
    });
    const createdBlogs = await blogs.save();
    res.send({ message: "Post Created", blogs: createdBlogs });
  })
);

blogRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const blogId = req.params.id;
    const blogs = await Blog.findById(blogId);
    if (blogs) {
      blogs.title = req.body.title;
      blogs.desc = req.body.desc;
      blogs.tag = req.body.tag;
      blogs.highlight = req.body.highlight;
      blogs.category = req.body.category;
      blogs.photo = req.body.photo;
      blogs.isApprove = req.body.isApprove;
      blogs.isRejected = req.body.isRejected;
      blogs.reason = req.body.reason;
      const updatedBlog = await blogs.save();
      res.send({ message: "Post Updated", blogs: updatedBlog });
    } else {
      res.status(404).send({ message: "Post Not Found" });
    }
  })
);

blogRouter.delete(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const blogs = await Blog.findById(req.params.id);
    if (blogs) {
      const deleteBlog = await blogs.remove();
      res.send({ message: "Post Deleted", blogs: deleteBlog });
    } else {
      res.status(404).send({ message: "Post Not Found" });
    }
  })
);

blogRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const blogId = req.params.id;
    const blogs = await Blog.findById(blogId);
    if (blogs) {
      const review = {
        name: req.user.first_name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      blogs.reviews.push(review);
      blogs.nun_reviews = blogs.reviews.length;
      blogs.rating =
        blogs.reviews.reduce((a, c) => c.rating + a, 0) / blogs.reviews.length;
      const updatedBlog = await blogs.save();
      res.status(201).send({
        message: "Review Created",
        review: updatedBlog.reviews[updatedBlog.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: "Review Not Found" });
    }
  })
);

export default blogRouter;
