import { getSessionData } from "./session";

//function to check user suthorization
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSessionData("session");
  if (!session) return false;
  if (session?.isAuthenticated) return true;
  return false;
}
