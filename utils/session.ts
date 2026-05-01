"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export interface ISession {
  token: string;
  isAuthenticated: boolean;
}
//function to get session data
export async function getSessionData(key: string): Promise<ISession | null> {
  const cookieStore = await cookies();
  const data = cookieStore.get(key)?.value;
  if (!data) return null;
  return JSON.parse(data);
}

//function to delete session data
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export const handleLogout = async () => {
  await clearSession();
  redirect("/signin");
};
