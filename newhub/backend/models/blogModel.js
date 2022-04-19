import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true},
    seller: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
    desc: { type: String, required: true },
    photo: { type: String, required: false },
    category: { type: String, required: true},
    tag: { type:Array, required: false},
    highlight: { type:String, required: true},
    rating: { type: Number, default: 0, required: false },
    nun_reviews: { type: Number, default: 0, required: false },
    isApprove: { type: Boolean, default: false, required: false },
    isRejected: { type: Boolean, default: false, required: false },
    reason: { type: String, required: false },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
