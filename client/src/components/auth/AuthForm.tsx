"use client";

import { useTransition } from "react";
import { Metadata } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import FormRow from "@/components/common/FormRow";
import ButtonLoading from "@/components/common/ButtonLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, signup } from "@/actions/auth";

export const metadata: Metadata = { title: "Signup" };

interface AuthFormProps {
  isLogin?: boolean;
}

interface DataForm {
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  confirmPassword?: string;
}

const AuthForm = ({ isLogin }: AuthFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<DataForm>({
    defaultValues: {
      email: "user1@example.com",
      password: "123456Aa",
    },
  });

  const onSubmit = (data: DataForm) => {
    const { email, firstName, lastName, password } = data;
    startTransition(async () => {
      const redirectPath = isLogin ? "/" : "/login";
      let data;
      if (isLogin) {
        data = await login({ email, password });
      } else {
        data = await signup({ email, firstName, lastName, password });
      }

      if (data.status === "success") {
        toast.success(data.message);
        router.push(redirectPath);
      }
      if (data.status === "error") toast.error(data.message);
    });
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      {!isLogin && (
        <div className="grid grid-cols-2 items-start gap-4">
          <FormRow label="First name" error={errors?.firstName?.message}>
            <Input
              placeholder="Max"
              className={
                errors.firstName
                  ? "border-red-600 focus-visible:ring-red-500"
                  : ""
              }
              {...register("firstName", {
                required: "First name field is required!",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters long!",
                },
                maxLength: {
                  value: 50,
                  message: "First name must not exceed 50 characters!",
                },
              })}
            />
          </FormRow>

          <FormRow label="Last name" error={errors?.lastName?.message}>
            <Input
              placeholder="Robinson"
              className={
                errors.lastName
                  ? "border-red-600 focus-visible:ring-red-500"
                  : ""
              }
              {...register("lastName", {
                required: "Last name field is required!",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters long!",
                },
                maxLength: {
                  value: 50,
                  message: "Last name must not exceed 50 characters!",
                },
              })}
            />
          </FormRow>
        </div>
      )}

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          placeholder="m@example.com"
          className={
            errors.email ? "border-red-600 focus-visible:ring-red-500" : ""
          }
          {...register("email", {
            required: "Email field is required!",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email must be a valid email address!",
            },
          })}
        />
      </FormRow>

      <FormRow label="Password" error={errors?.password?.message}>
        <Input
          type="password"
          className={
            errors.password ? "border-red-600 focus-visible:ring-red-500" : ""
          }
          {...register("password", {
            required: "Password field is required!",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
              message: "Password must include 1 uppercase, lowercase, & number",
            },
          })}
        />
      </FormRow>

      {!isLogin && (
        <FormRow
          label="Confirm password"
          error={errors?.confirmPassword?.message}
        >
          <Input
            type="password"
            className={
              errors.confirmPassword
                ? "border-red-600 focus-visible:ring-red-500"
                : ""
            }
            {...register("confirmPassword", {
              validate: (value) =>
                value === getValues().password || "Passwords do not match",
            })}
          />
        </FormRow>
      )}

      {isPending ? (
        <ButtonLoading />
      ) : (
        <Button type="submit" className="w-full">
          {isLogin ? "Login" : "Create an account"}
        </Button>
      )}
    </form>
  );
};

export default AuthForm;
