import { cookies } from "next/headers";

export const token = () => cookies().get("token")?.value;
export const authz = () => ({ Authorization: `Bearer ${token()}` });
