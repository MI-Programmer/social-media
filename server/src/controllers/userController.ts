import { Request, Response } from "express";
import { User } from "@prisma/client";

export const getUser = async (req: Request, res: Response) => {
  const { password, ...user } = req.user as User;
  res.status(200).json({ user });
};
