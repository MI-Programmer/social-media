import { Request, Response } from "express";
import { ZodError } from "zod";

import prisma from "../lib/prismaClient";
import { updateUserValidation } from "../lib/zod";
import { deleteImageCloudinary, error, uploadImage } from "../utils/helper";
import { User } from "@prisma/client";

export const getUser = async (req: Request, res: Response) => {
  const { password, ...user } = req.user as User;
  res.status(200).json({ user });
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = +req.params.userId || 0;

  const { password, ...user } = (await prisma.user.findUnique({
    where: { id: userId },
    include: {
      friends: {
        include: {
          friend: {
            select: { imageUrl: true, firstName: true, lastName: true },
          },
        },
      },
      friendsOf: true,
    },
  })) as User;
  if (!user) {
    error.message = "User not found.";
    error.status = 404;
    throw error;
  }

  res.status(200).json({ user });
};

export const createFriend = async (req: Request, res: Response) => {
  const friendId = +req.params.friendId | 0;
  const user = req.user as User;

  const friendUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true },
  });
  if (!friendUser) {
    error.message = "Not found friend user.";
    error.status = 404;
    throw error;
  }

  await prisma.friendship.createMany({
    data: [
      { userId: user.id, friendId },
      { userId: friendId, friendId: user.id },
    ],
  });
  res.status(200).json({ message: "Successfully created friend!" });
};

export const updateUser = async (req: Request, res: Response) => {
  const { firstName, lastName } = req.body;
  const user = req.user as User;

  try {
    await updateUserValidation.parseAsync({ firstName, lastName });
  } catch (errorsZod) {
    error.message = "Validations failed.";
    if (errorsZod instanceof ZodError) error.data = errorsZod.errors;
    error.status = 400;
    throw error;
  }

  let upload;
  if (req.file) {
    upload = await uploadImage("social-media/user-profile", req.file.buffer);

    if (user.imageUrl) {
      await deleteImageCloudinary(user.imageUrl, "profile");
    }
  }

  const imageUrl = upload ? { imageUrl: upload.secure_url } : {};
  await prisma.user.update({
    where: { id: user.id },
    data: { firstName, lastName, ...imageUrl },
  });
  res.status(200).json({ message: "Successfully updated user data!" });
};

export const deleteFriend = async (req: Request, res: Response) => {
  const friendId = +req.params.friendId || 0;
  const user = req.user as User;

  await prisma.friendship.delete({
    where: { userId_friendId: { userId: user.id, friendId } },
  });
  await prisma.friendship.delete({
    where: { userId_friendId: { userId: friendId, friendId: user.id } },
  });

  res.status(200).json({ message: "Successfully deleted friend user!" });
};
