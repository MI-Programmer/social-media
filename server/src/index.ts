import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import likeRoutes from "./routes/likeRoutes";
import commentRoutes from "./routes/commentRoutes";
import passport from "./lib/passport";
import { CustomError } from "./utils/helper";
import upload from "./middleware/upload";

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("common"));
app.use(passport.initialize());
app.use(upload.single("image"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/likes", likeRoutes);
app.use("/api/posts/:postId/comments", commentRoutes);
app.use("/api", userRoutes);

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const { message, status = 500, data } = error;
    data ? (error.data = { data }) : (error.data = {});

    console.error("Unhandled Error:", error);
    res
      .status(status)
      .json({ message: message || "Internal Server Error", ...error.data });
  }
);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
