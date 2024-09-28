import { Metadata } from "next";

import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = { title: "Signup" };

const Signup = () => {
  return <AuthPage />;
};

export default Signup;
