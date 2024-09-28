"use server";

import { cookies } from "next/headers";
import axios from "axios";

import { URL_API } from "@/utils/constant";
import { catchAsync } from "@/utils/catchAsync";

export const getUser = catchAsync(async () => {
  const token = cookies().get("token")?.value;
  const { data } = await axios.get(`${URL_API}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data.user;
});
