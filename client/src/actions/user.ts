"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import axios from "axios";

import { URL_API } from "@/utils/constant";
import { authz } from "@/utils/helper";
import { catchAsync } from "@/utils/catchAsync";

export const getUser = catchAsync(async () => {
  const { data } = await axios.get(`${URL_API}/user`, {
    headers: authz(),
  });

  return data.user;
});

export const getUserById = catchAsync(async (userId: number) => {
  const { data } = await axios.get(`${URL_API}/users/${userId}`, {
    headers: authz(),
  });

  return data.user;
});

export const createFriend = catchAsync(async (formData: FormData) => {
  const friendId = formData.get("friendId");
  await axios.post(
    `${URL_API}/users/friends/${friendId}`,
    {},
    {
      headers: authz(),
    },
  );

  const referer = headers().get("referer");
  const url = new URL(referer!);
  revalidatePath(url.pathname);
});

export const updateUser = catchAsync(async (formData: FormData) => {
  const { data } = await axios.put(`${URL_API}/users`, formData, {
    headers: authz(),
  });

  revalidatePath("/profile");
  return { ...data, status: "success" };
});

export const deleteFriend = catchAsync(async (formData: FormData) => {
  const friendId = formData.get("friendId");
  await axios.delete(`${URL_API}/users/friends/${friendId}`, {
    headers: authz(),
  });

  const referer = headers().get("referer");
  const url = new URL(referer!);
  revalidatePath(url.pathname);
});
