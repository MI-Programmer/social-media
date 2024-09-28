import { Metadata } from "next";

import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = { title: "Login" };

const Login = () => {
  return <AuthPage isLogin={true} />;
};

export default Login;
