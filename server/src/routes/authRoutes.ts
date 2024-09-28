import { Router } from "express";

import { login, signup } from "../controllers/authController";
import catchAsync from "../utils/catchAsync";

const router = Router();

router.post("/signup", catchAsync(signup));

router.post("/login", catchAsync(login));

export default router;
