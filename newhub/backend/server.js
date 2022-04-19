import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import userRouter from "./routers/UserRouter.js";
import blogRouter from "./routers/blogRouter.js";
import uploadRouter from "./routers/uploadRouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/newshub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//API ROUTER

app.use("/api/uploads", uploadRouter);
app.use("/api/users", userRouter); //User api
app.use("/api/blogs", blogRouter); //blog api


//displaying our image at the frontend after upload
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Error catcher or tracker in router
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
