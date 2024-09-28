"use server";

import { cookies } from "next/headers";
import axios from "axios";

import { URL_API } from "@/utils/constant";
import { catchAsync } from "@/utils/catchAsync";

interface UserData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

export const signup = catchAsync(async (userData: UserData) => {
  const { firstName, lastName, email, password } = userData || {};
  const { data } = await axios.post(`${URL_API}/auth/signup`, {
    email,
    firstName,
    lastName,
    password,
  });

  return { message: data.message, status: "success" };
});

export const login = catchAsync(async (userData: UserData) => {
  const { email, password } = userData || {};
  const { data } = await axios.post(`${URL_API}/auth/login`, {
    email,
    password,
  });

  cookies().set("token", data.token);
  return { message: data.message, status: "success" };
});

export const logout = catchAsync(async () => {
  cookies().delete("token");
  return { message: "Successfully logged out!", status: "success" };
});
