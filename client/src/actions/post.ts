"use server";

import { cookies } from "next/headers";
import axios from "axios";

import { getUser } from "@/actions/user";
import { URL_API } from "@/utils/constant";
import { catchAsync } from "@/utils/catchAsync";
import { Post } from "@/types/post";

interface UnlikePost {
  postId: number;
  likeId: number;
}

interface CreatePostComment {
  postId: number;
  content: string;
}

const token = () => cookies().get("token")?.value;
const headers = () => ({ Authorization: `Bearer ${token()}` });

export const getPosts = catchAsync(async () => {
  const { data } = await axios.get(`${URL_API}/posts`, {
    headers: headers(),
  });

  return data.posts as Post[];
});

export const getUserPosts = catchAsync(async () => {
  const user = await getUser();
  const { data } = await axios.get(`${URL_API}/posts/user/${user.id}`, {
    headers: headers(),
  });

  return data.posts as Post[];
});

export const getPost = catchAsync(async (postId: string) => {
  const { data } = await axios.get(`${URL_API}/posts/${postId}`, {
    headers: headers(),
  });

  return data.post as Post;
});

export const createPost = catchAsync(async (formData: FormData) => {
  const { data } = await axios.post(`${URL_API}/posts`, formData, {
    headers: headers(),
  });

  return { message: data.message, status: "success" };
});

export const createPostComment = catchAsync(
  async ({ postId, content }: CreatePostComment) => {
    const { data } = await axios.post(
      `${URL_API}/posts/${postId}/comment`,
      { content },
      {
        headers: headers(),
      },
    );

    return { message: data.message, status: "success" };
  },
);

export const likePost = catchAsync(async (postId: number) => {
  await axios.post(
    `${URL_API}/posts/${postId}/like`,
    {},
    {
      headers: headers(),
    },
  );

  return { status: "success" };
});

export const unlikePost = catchAsync(async ({ postId, likeId }: UnlikePost) => {
  await axios.delete(`${URL_API}/posts/${postId}/like/${likeId}`, {
    headers: headers(),
  });

  return { status: "success" };
});

export const deletePost = catchAsync(async (postId: number) => {
  const { data } = await axios.delete(`${URL_API}/posts/${postId}`, {
    headers: headers(),
  });

  return { message: data.message, status: "success" };
});
