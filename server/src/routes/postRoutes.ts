import { Router } from "express";

import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  updatePost,
} from "../controllers/postController";
import catchAsync from "../utils/catchAsync";

const router = Router();

router.get("/", catchAsync(getPosts));

router.get("/user/:userId", catchAsync(getUserPosts));

router.get("/:postId", catchAsync(getPost));

router.post("/", catchAsync(createPost));

router.put("/:postId", catchAsync(updatePost));

router.delete("/:postId", catchAsync(deletePost));

export default router;
