import { Router } from "express";

import { likePost, unlikePost } from "../controllers/likeController";
import catchAsync from "../utils/catchAsync";

const router = Router({ mergeParams: true });

router.post("/", catchAsync(likePost));

router.delete("/:likeId", catchAsync(unlikePost));

export default router;
