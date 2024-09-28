import { Router } from "express";

import { createPostComment } from "../controllers/commentController";
import { isAuthenticated } from "../lib/passport";
import catchAsync from "../utils/catchAsync";

const router = Router({ mergeParams: true });

router.post("/", isAuthenticated, catchAsync(createPostComment));

export default router;
