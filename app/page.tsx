import Button from "@/Components/UI/Button";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { handleLogout } from "@/utils/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const isAllowed = await isAuthenticated();
  if (!isAllowed) redirect("/signin");


  return (
    <>
      Home
      <form action={handleLogout}>
        <Button type="submit">Logout</Button>
      </form>
    </>
  );
}
