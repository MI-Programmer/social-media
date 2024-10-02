import { Request, Response } from "express";
import { ZodError } from "zod";

import prisma from "../lib/prismaClient";
import { postValidation } from "../lib/zod";
import { deleteImageCloudinary, error, uploadImage } from "../utils/helper";
import { User } from "@prisma/client";

interface ReqBodyPost {
  content: string;
}

const PAGE_SIZE = 5;

export const getPosts = async (req: Request, res: Response) => {
  const page = +req.query.page! || 1;

  const posts = await prisma.post.findMany({
    include: {
      likes: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      comments: { select: { id: true } },

      tags: true,
      author: {
        select: { id: true, firstName: true, lastName: true, imageUrl: true },
      },
    },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ posts });
};

export const getUserPosts = async (req: Request, res: Response) => {
  const page = +req.query.page! || 1;
  const userId = +req.params.userId || 0;

  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    include: {
      likes: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      comments: { select: { id: true } },
      tags: true,
      author: {
        select: { id: true, firstName: true, lastName: true, imageUrl: true },
      },
    },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: { createdAt: "desc" },
  });

  if (!posts) {
    error.message = "Posts not found.";
    error.status = 404;
    throw error;
  }

  res.status(200).json({ posts });
};

export const getPost = async (req: Request, res: Response) => {
  const postId = +req.params.postId;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      likes: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      comments: {
        include: {
          author: {
            select: { firstName: true, lastName: true, imageUrl: true },
          },
        },
      },
      tags: true,
      author: {
        select: { id: true, firstName: true, lastName: true, imageUrl: true },
      },
    },
  });

  if (!post) {
    error.message = "Post not found.";
    error.status = 404;
    throw error;
  }

  res.status(200).json({ post });
};

export const createPost = async (req: Request, res: Response) => {
  const { content } = req.body as ReqBodyPost;
  try {
    await postValidation.parseAsync({ content });
  } catch (errorsZod) {
    error.message = "Validations failed.";
    if (errorsZod instanceof ZodError) error.data = errorsZod.errors;
    error.status = 400;
    throw error;
  }
  if (!req.file) {
    error.message = "Invalid file type or no file uploaded.";
    error.status = 400;
    throw error;
  }
  const upload = await uploadImage("social-media/posts", req.file.buffer);
  const user = req.user as User;
  const post = await prisma.post.create({
    data: {
      content,
      imageUrl: upload!.secure_url,
      author: { connect: { id: user.id } },
    },
  });

  res.status(201).json({ message: "Successfully created post!", post });
};

export const updatePost = async (req: Request, res: Response) => {
  const { content } = req.body as ReqBodyPost;
  const postId = +req.params.postId || 0;
  const user = req.user as User;

  try {
    await postValidation.parseAsync({ content });
  } catch (errorsZod) {
    error.message = "Validations failed.";
    if (errorsZod instanceof ZodError) error.data = errorsZod.errors;
    error.status = 400;
    throw error;
  }

  const existPost = await prisma.post.findUnique({ where: { id: postId } });
  if (!existPost || existPost.authorId !== user.id) {
    error.message = existPost ? "Unauthorized." : "Post not found.";
    error.status = existPost ? 401 : 404;
    throw error;
  }

  let upload;
  if (req.file) {
    upload = await uploadImage("social-media/posts", req.file.buffer);
    await deleteImageCloudinary(existPost.imageUrl, "posts");
  }

  const updateImage = upload ? { imageUrl: upload.secure_url } : {};
  const post = await prisma.post.update({
    where: { id: postId },
    data: { content, ...updateImage },
  });

  res.status(200).json({ message: "Successfully updated post!", post });
};

export const deletePost = async (req: Request, res: Response) => {
  const postId = +req.params.postId;
  const user = req.user as User;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    error.message = "Post not found.";
    error.status = 404;
    throw error;
  }

  if (post.authorId !== user.id) {
    error.message = "Unauthorized.";
    error.status = 401;
    throw error;
  }

  await deleteImageCloudinary(post.imageUrl, "posts");
  await prisma.post.delete({ where: { id: postId } });

  res.status(200).json({ message: "Successfully deleted post!" });
};
