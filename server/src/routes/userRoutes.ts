import { Router } from "express";

import {
  createFriend,
  deleteFriend,
  getUser,
  getUserById,
  updateUser,
} from "../controllers/userController";
import catchAsync from "../utils/catchAsync";

const router = Router();

router.get("/user", catchAsync(getUser));

router.get("/users/:userId", catchAsync(getUserById));

router.post("/users/friends/:friendId", catchAsync(createFriend));

router.put("/users", catchAsync(updateUser));

router.delete("/users/friends/:friendId", catchAsync(deleteFriend));

export default router;
