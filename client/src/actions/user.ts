"use server";

import axios from "axios";

import { URL_API } from "@/utils/constant";
import { authz } from "@/utils/helper";
import { catchAsync } from "@/utils/catchAsync";
import { revalidatePath } from "next/cache";

export const getUser = catchAsync(async () => {
  const { data } = await axios.get(`${URL_API}/user`, {
    headers: authz(),
  });

  return data.user;
});

export const updateUser = catchAsync(async (formData: FormData) => {
  const { data } = await axios.put(`${URL_API}/user`, formData, {
    headers: authz(),
  });

  revalidatePath("/profile");
  return { ...data, status: "success" };
});
