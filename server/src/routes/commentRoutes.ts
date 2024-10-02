import { Router } from "express";

import {
  createPostComment,
  deletePostComment,
  updatePostComment,
} from "../controllers/commentController";
import { isAuthenticated } from "../lib/passport";
import catchAsync from "../utils/catchAsync";

const router = Router({ mergeParams: true });

router.post("/", isAuthenticated, catchAsync(createPostComment));

router.put("/:commentId", isAuthenticated, catchAsync(updatePostComment));

router.delete("/:commentId", isAuthenticated, catchAsync(deletePostComment));

export default router;
