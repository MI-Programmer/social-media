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

export const updatePostComment = async (req: Request, res: Response) => {
  const { content } = req.body as ReqBodyComment;
  const postId = +req.params.postId;
  const commentId = +req.params.commentId;
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

  const existComment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!existComment || existComment.authorId !== user.id) {
    error.message = existComment ? "Unauthorized" : "Comment not found.";
    error.status = existComment ? 401 : 404;
    throw error;
  }

  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });

  res
    .status(200)
    .json({ message: "Successfully updated post comment!", comment });
};

export const deletePostComment = async (req: Request, res: Response) => {
  const postId = +req.params.postId;
  const commentId = +req.params.commentId;
  const user = req.user as User;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) {
    error.message = "Post not found.";
    error.status = 404;
    throw error;
  }

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.authorId !== user.id) {
    error.message = comment ? "Unauthorized" : "Comment not found.";
    error.status = comment ? 401 : 404;
    throw error;
  }

  await prisma.comment.delete({ where: { id: commentId } });

  res.status(200).json({ message: "Successfully deleted post comment!" });
};
