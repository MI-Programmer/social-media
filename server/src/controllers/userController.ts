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
