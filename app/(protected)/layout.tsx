import { getSessionData } from "@/utils/session";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";
import React from "react";
import Navbar from "@/Components/UI/Navbar";

async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAllowed = await isAuthenticated();
  if (!isAllowed) redirect("/signin");

  return (
    <div className="h-screen">
      <Navbar />
      {children}
    </div>
  );
}

export default ProtectedLayout;
