import { Router } from "express";

import {
  createPostComment,
  deletePostComment,
  updatePostComment,
} from "../controllers/commentController";
import catchAsync from "../utils/catchAsync";

const router = Router({ mergeParams: true });

router.post("/", catchAsync(createPostComment));

router.put("/:commentId", catchAsync(updatePostComment));

router.delete("/:commentId", catchAsync(deletePostComment));

export default router;
