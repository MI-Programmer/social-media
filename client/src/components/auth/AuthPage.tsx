import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthForm from "@/components/auth/AuthForm";

interface AuthPageProps {
  isLogin?: boolean;
}

const AuthPage = ({ isLogin }: AuthPageProps) => {
  return (
    <section className="flex h-[80vh] items-center justify-center">
      <Card className="min-w-96 max-w-sm md:min-w-[448px] md:max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">
            {isLogin ? "Login" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your email below to login to your account"
              : "Enter your information to create an account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AuthForm isLogin={isLogin} />

          <div className="mt-4 text-center text-sm">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline">
                  Signup
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AuthPage;
