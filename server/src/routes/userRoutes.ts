import { Router } from "express";

import { getUser } from "../controllers/userController";
import catchAsync from "../utils/catchAsync";
import { isAuthenticated } from "../lib/passport";

const router = Router();

router.get("/user", isAuthenticated, catchAsync(getUser));

export default router;
