"use server";

import { revalidatePath } from "next/cache";
import axios from "axios";

import { getUser } from "@/actions/user";
import { URL_API } from "@/utils/constant";
import { catchAsync } from "@/utils/catchAsync";
import { authz } from "@/utils/helper";
import { Post } from "@/types/post";

interface UnlikePost {
  postId: number;
  likeId: number;
}

interface CreatePostComment {
  postId: number;
  content: string;
}

interface UpdatePostComment {
  postId: number;
  commentId: number;
  content: string;
}

interface DeletePostComment {
  postId: number;
  commentId: number;
}

export const getPosts = catchAsync(async (page: number) => {
  const { data } = await axios.get(`${URL_API}/posts?page=${page || 1}`, {
    headers: authz(),
  });

  return data.posts as Post[];
});

export const getUserPosts = catchAsync(async (page: number) => {
  const user = await getUser();
  const { data } = await axios.get(
    `${URL_API}/posts/user/${user.id}?page=${page || 1}`,
    {
      headers: authz(),
    },
  );

  return data.posts as Post[];
});

export const getPost = catchAsync(async (postId: string) => {
  const { data } = await axios.get(`${URL_API}/posts/${postId}`, {
    headers: authz(),
  });

  return data.post as Post;
});

export const createPost = catchAsync(async (formData: FormData) => {
  const { data } = await axios.post(`${URL_API}/posts`, formData, {
    headers: authz(),
  });

  return { ...data, status: "success" };
});

export const updatePost = catchAsync(
  async (formData: FormData, postId: number) => {
    const { data } = await axios.put(`${URL_API}/posts/${postId}`, formData, {
      headers: authz(),
    });

    return { message: data.message, status: "success" };
  },
);

export const deletePost = catchAsync(async (postId: number) => {
  const { data } = await axios.delete(`${URL_API}/posts/${postId}`, {
    headers: authz(),
  });

  return { message: data.message, status: "success" };
});

export const likePost = catchAsync(async (postId: number) => {
  await axios.post(
    `${URL_API}/posts/${postId}/likes`,
    {},
    {
      headers: authz(),
    },
  );

  return { status: "success" };
});

export const unlikePost = catchAsync(async ({ postId, likeId }: UnlikePost) => {
  await axios.delete(`${URL_API}/posts/${postId}/likes/${likeId}`, {
    headers: authz(),
  });

  return { status: "success" };
});

export const createPostComment = catchAsync(
  async ({ postId, content }: CreatePostComment) => {
    const { data } = await axios.post(
      `${URL_API}/posts/${postId}/comments`,
      { content },
      {
        headers: authz(),
      },
    );

    return { message: data.message, status: "success" };
  },
);

export const updatePostComment = catchAsync(
  async ({ postId, commentId, content }: UpdatePostComment) => {
    await axios.put(
      `${URL_API}/posts/${postId}/comments/${commentId}`,
      { content },
      {
        headers: authz(),
      },
    );

    revalidatePath(`/posts/${postId}`);
  },
);

export const deletePostComment = catchAsync(
  async ({ postId, commentId }: DeletePostComment) => {
    await axios.delete(`${URL_API}/posts/${postId}/comments/${commentId}`, {
      headers: authz(),
    });

    revalidatePath(`/posts/${postId}`);
  },
);
