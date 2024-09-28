import { Router } from "express";

import { likePost, unlikePost } from "../controllers/likeController";
import { isAuthenticated } from "../lib/passport";
import catchAsync from "../utils/catchAsync";

const router = Router({ mergeParams: true });

router.post("/", isAuthenticated, catchAsync(likePost));

router.delete("/:likeId", isAuthenticated, catchAsync(unlikePost));

export default router;
