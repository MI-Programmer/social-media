import { Router } from "express";

import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
} from "../controllers/postController";
import { isAuthenticated } from "../lib/passport";
import catchAsync from "../utils/catchAsync";

const router = Router();

router.get("/", isAuthenticated, catchAsync(getPosts));

router.get("/user/:userId", isAuthenticated, catchAsync(getUserPosts));

router.get("/:postId", isAuthenticated, catchAsync(getPost));

router.post("/", isAuthenticated, catchAsync(createPost));

router.put("/:postId");

router.delete("/:postId", isAuthenticated, catchAsync(deletePost));

export default router;
