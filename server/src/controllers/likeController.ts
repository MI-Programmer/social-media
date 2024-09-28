import { Request, Response } from "express";

import prisma from "../lib/prismaClient";
import { error } from "../utils/helper";
import { User } from "@prisma/client";

export const likePost = async (req: Request, res: Response) => {
  const postId = +req.params.postId;
  const user = req.user as User;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      likes: { select: { userId: true } },
    },
  });
  if (!post) {
    error.message = "Post not found.";
    error.status = 404;
    throw error;
  }

  if (post.likes.some((like) => like.userId === user.id)) {
    error.message = "Post has already been liked.";
    error.status = 400;
    throw error;
  }

  await prisma.like.create({
    data: {
      user: { connect: { id: user.id } },
      post: { connect: { id: postId } },
    },
  });

  res.status(201).json({ message: "Successfully created like post!" });
};

export const unlikePost = async (req: Request, res: Response) => {
  const postId = +req.params.postId;
  const likeId = +req.params.likeId;
  const user = req.user as User;

  const like = await prisma.like.findUnique({
    where: { id: likeId },
  });
  if (!like || like.userId !== user.id) {
    error.message = like
      ? "Unauthorized to delete this like."
      : "Like not found.";
    error.status = like ? 403 : 404;
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

  await prisma.like.delete({ where: { id: likeId } });

  res.status(201).json({ message: "Successfully deleted like post!" });
};
