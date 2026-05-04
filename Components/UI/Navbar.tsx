import Link from "next/link";
import React from "react";
import Button from "./Button";
import { User } from "lucide-react";
import { handleLogout } from "@/utils/session";

function Navbar() {
  return (
    <nav className="flex items-center justify-between gap-5 p-3 bg-black text-white sticky top-0">
      <h2 className="font-medium">EVENT0</h2>
      <div className="flex items-center gap-2">
        <Link href={"/"}>Home</Link>
        <Link href={"/about"}>About</Link>
        <Link href={"/events"}>Events</Link>
        <div className="group relative">
          <Button variant="ghost" className="p-1! h-fit bg-white">
            <User className="w-4 h-4" />
          </Button>
          <form
            action={handleLogout}
            className="group-hover:block absolute -bottom-10 -left-10 hidden"
          >
            <Button type="submit">Logout</Button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
