import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { loginValidation, signinValidation } from "../lib/zod";
import prisma from "../lib/prismaClient";
import { error } from "../utils/helper";

interface ReqBodyLogin {
  email: string;
  password: string;
}

interface ReqBodySignup extends ReqBodyLogin {
  firstName: string;
  lastName: string;
}

export const signup = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req.body as ReqBodySignup;
  try {
    await signinValidation.parseAsync({ email, firstName, lastName, password });
  } catch (errorsZod) {
    error.message = "Validations failed.";
    if (errorsZod instanceof ZodError) error.data = errorsZod.errors;
    error.status = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (user) {
    error.message = `Email "${email}" is already exist. Please use a different email.`;
    error.status = 409;
    throw error;
  }

  const hashedPassword = await hash(password, 12);
  await prisma.user.create({
    data: { email, firstName, lastName, password: hashedPassword },
  });
  res
    .status(201)
    .json({ message: "Successfully signed in! Please log in to continue." });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as ReqBodyLogin;
  try {
    await loginValidation.parseAsync({ email, password });
  } catch (errorsZod) {
    error.message = "Validations failed.";
    if (errorsZod instanceof ZodError) {
      error.data = errorsZod.errors;
    }
    error.status = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    error.message =
      "Email not found. Please check your email address or sign up for a new account.";
    error.status = 404;
    throw error;
  }

  const isValidPassword = await compare(password, user.password);
  if (!isValidPassword) {
    error.message = "Incorrect password. Please try again.";
    error.status = 401;
    throw error;
  }

  const { password: passHash, ...userWithoutPassword } = user;
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" }
  );
  res.status(200).json({
    message: "Successfully logged in! Welcome back.",
    user: userWithoutPassword,
    token,
  });
};
