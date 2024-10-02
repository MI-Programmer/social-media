import z from "zod";

const userFullName = {
  firstName: z
    .string({ required_error: "First name field is required!" })
    .min(2, { message: "First name must be at least 2 characters long!" })
    .max(50, { message: "First name must not exceed 50 characters!" }),

  lastName: z
    .string({ required_error: "Last name field is required!" })
    .min(2, { message: "Last name must be at least 2 characters long!" })
    .max(50, { message: "Last name must not exceed 50 characters!" }),
};

export const signinValidation = z.object({
  email: z
    .string({ required_error: "Email field is required!" })
    .email({ message: "Email must be a valid email address!" })
    .min(5, { message: "Email must be at least 5 characters long!" })
    .max(255, { message: "Email must not exceed 255 characters!" }),

  password: z
    .string({ required_error: "Password field is required!" })
    .min(8, { message: "Password must be at least 8 characters long!" })
    .max(100, { message: "Password must not exceed 100 characters!" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter!",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter!",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number!" }),

  ...userFullName,
});

export const loginValidation = z.object({
  email: z
    .string({ required_error: "Email field is required!" })
    .email({ message: "Email must be a valid email address!" })
    .min(5, { message: "Email must be at least 5 characters long!" })
    .max(255, { message: "Email must not exceed 255 characters!" }),

  password: z
    .string({ required_error: "Password field is required!" })
    .min(8, { message: "Password must be at least 8 characters long!" })
    .max(100, { message: "Password must not exceed 100 characters!" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter!",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter!",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number!" }),
});

export const postValidation = z.object({
  content: z
    .string({ required_error: "Content field is required!" })
    .min(1, { message: "Content must be at least 5 characters long!" }),
});

export const commentValidation = z.object({
  content: z
    .string({ required_error: "Content field is required!" })
    .min(1, { message: "Content must be at least 5 characters long!" }),
});

export const updateUserValidation = z.object({ ...userFullName });
