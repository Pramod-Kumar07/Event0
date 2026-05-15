import Navbar from "@/Components/UI/Navbar";
import AddVenu from "@/Components/Venu/AddVenu";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";

export default async function Home() {
  const isAllowed = await isAuthenticated();
  if (!isAllowed) redirect("/signin");

  return (
    <div className="h-screen">
      <Navbar />
      Home
      <AddVenu />
    </div>
  );
}
