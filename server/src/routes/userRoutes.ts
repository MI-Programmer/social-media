import { Router } from "express";

import { getUser, updateUser } from "../controllers/userController";
import catchAsync from "../utils/catchAsync";
import { isAuthenticated } from "../lib/passport";

const router = Router();

router.get("/user", isAuthenticated, catchAsync(getUser));

router.put("/user", isAuthenticated, catchAsync(updateUser));

export default router;
