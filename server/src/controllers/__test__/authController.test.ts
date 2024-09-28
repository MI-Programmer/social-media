import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { login, signup } from "../authController";
import prisma from "../../lib/prismaClient";
import { CustomError } from "../../utils/helper";

describe("AuthController", () => {
  describe("Signup", () => {
    it("should throw an error when user input is invalid", async () => {
      const req: Partial<Request> = {
        body: {
          email: "testemail.com",
          firstName: "test",
          lastName: "test",
          password: "test",
        },
      };

      try {
        await signup(req as Request, {} as Response);
      } catch (error) {
        expect(error).toMatchObject({
          message: "Validations failed.",
          status: 400,
          data: expect.any(Array),
        });
        expect((error as CustomError).data).toHaveLength(4);
      }
    });

    it("should throw an error if input email user is already exist in the database", async () => {
      const req: Partial<Request> = {
        body: {
          email: "test@email.com",
          firstName: "test",
          lastName: "test",
          password: "123456Aa",
        },
      };
      const findUserSpy = jest
        .spyOn(prisma.user, "findUnique")
        .mockResolvedValue(true as any);

      await expect(
        signup(req as Request, {} as Response)
      ).rejects.toMatchObject({
        message: `Email "${req.body.email}" is already exist. Please use a different email.`,
        status: 409,
      });
      findUserSpy.mockRestore();
    });

    it("should generate a hash password, and return success response", async () => {
      const req: Partial<Request> = {
        body: {
          email: "test@email.com",
          firstName: "test",
          lastName: "test",
          password: "123456Aa",
        },
      };
      const { email, firstName, lastName, password } = req.body;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const findUserSpy = jest
        .spyOn(prisma.user, "findUnique")
        .mockResolvedValue(null);
      const createUserSpy = jest
        .spyOn(prisma.user, "create")
        .mockResolvedValue(true as any);
      const bcryptHashSpy = jest
        .spyOn(bcrypt, "hash")
        .mockResolvedValue("fake-hash" as never);

      await signup(req as Request, res as Response);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email, firstName, lastName, password: "fake-hash" },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully signed in! Please log in to continue.",
      });

      findUserSpy.mockRestore();
      createUserSpy.mockRestore();
      bcryptHashSpy.mockRestore();
    });
  });

  describe("Login", () => {
    it("should throw an error when user input is invalid", async () => {
      const req: Partial<Request> = {
        body: {
          email: "testemail.com",
          password: "test",
        },
      };

      try {
        await login(req as Request, {} as Response);
      } catch (error) {
        expect(error).toMatchObject({
          message: "Validations failed.",
          status: 400,
          data: expect.any(Array),
        });
        expect((error as CustomError).data).toHaveLength(4);
      }
    });

    it("should throw an error if email is not found in the database", async () => {
      const req: Partial<Request> = {
        body: {
          email: "test@email.com",
          password: "123456Aa",
        },
      };
      const findUserSpy = jest
        .spyOn(prisma.user, "findUnique")
        .mockResolvedValue(null);

      await expect(login(req as Request, {} as Response)).rejects.toMatchObject(
        {
          message:
            "Email not found. Please check your email address or sign up for a new account.",
          status: 404,
        }
      );
      findUserSpy.mockRestore();
    });

    it("should throw an error if the password is incorrect", async () => {
      const req: Partial<Request> = {
        body: {
          email: "test@email.com",
          password: "123456Aa",
        },
      };
      const findUserSpy = jest
        .spyOn(prisma.user, "findUnique")
        .mockResolvedValue(true as any);
      const bcryptCompareSpy = jest
        .spyOn(bcrypt, "compare")
        .mockResolvedValue(false as never);

      await expect(login(req as Request, {} as Response)).rejects.toMatchObject(
        {
          message: "Incorrect password. Please try again.",
          status: 401,
        }
      );

      findUserSpy.mockRestore();
      bcryptCompareSpy.mockRestore();
    });

    it("should generate a token, set cookie with correct parameters, and return success response", async () => {
      const req: Partial<Request> = {
        body: {
          email: "test@email.com",
          password: "123456Aa",
        },
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const findUserSpy = jest
        .spyOn(prisma.user, "findUnique")
        .mockResolvedValue({ id: "123" } as any);
      const bcryptCompareSpy = jest
        .spyOn(bcrypt, "compare")
        .mockResolvedValue(true as never);
      const jwtSignSpy = jest
        .spyOn(jwt, "sign")
        .mockReturnValue("fake-token" as any);

      await login(req as Request, res as Response);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: "123" },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Successfully logged in! Welcome back.",
        })
      );

      findUserSpy.mockRestore();
      bcryptCompareSpy.mockRestore();
      jwtSignSpy.mockRestore();
    });
  });
});
