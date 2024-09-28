import { Request, Response } from "express";
import { ZodError } from "zod";

import prisma from "../lib/prismaClient";
import { postValidation } from "../lib/zod";
import cloudinary from "../lib/cloudinary";
import { error } from "../utils/helper";
import { User } from "@prisma/client";

interface ReqBodyPost {
  content: string;
}

type CloudinaryUploadResult =
  | {
      secure_url: string;
    }
  | undefined;

export const getPosts = async (req: Request, res: Response) => {
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
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ posts });
};

export const getUserPosts = async (req: Request, res: Response) => {
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
        include: { author: { select: { firstName: true, lastName: true } } },
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
    if (errorsZod instanceof ZodError) {
      error.data = errorsZod.errors;
    }
    error.status = 400;
    throw error;
  }

  if (!req.file) {
    error.message = "Invalid file type or no file uploaded.";
    error.status = 400;
    throw error;
  }

  const upload = await new Promise<CloudinaryUploadResult>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "social-media/posts" },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        )
        .end(req.file?.buffer);
    }
  );

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

  const regexImg = /\/(social-media\/posts\/[^.]+)\./;
  const matchImg = post.imageUrl.match(regexImg);
  const publicId = matchImg && matchImg[1] ? matchImg[1] : "";

  await cloudinary.uploader.destroy(publicId);
  await prisma.post.delete({ where: { id: postId } });

  res.status(200).json({ message: "Successfully deleted post!" });
};
