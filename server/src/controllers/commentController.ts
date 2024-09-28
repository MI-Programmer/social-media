import { Request, Response } from "express";
import { ZodError } from "zod";

import prisma from "../lib/prismaClient";
import { postValidation } from "../lib/zod";
import { error } from "../utils/helper";
import { User } from "@prisma/client";

interface ReqBodyComment {
  content: string;
}

export const createPostComment = async (req: Request, res: Response) => {
  const { content } = req.body as ReqBodyComment;
  const postId = +req.params.postId;
  const user = req.user as User;

  try {
    await postValidation.parseAsync({ content });
  } catch (errorsZod) {
    error.message = "Validations failed.";
    if (errorsZod instanceof ZodError) {
      error.data = errorsZod.errors;
    }
    error.status = 400;
    throw error;
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) {
    error.message = "Post not found.";
    error.status = 404;
    throw error;
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      author: { connect: { id: user.id } },
      post: { connect: { id: postId } },
    },
  });

  res
    .status(201)
    .json({ message: "Successfully created post comment!", comment });
};
