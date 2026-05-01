import { getSessionData } from "@/utils/session";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { redirect } from "next/navigation";
import React from "react";

async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAllowed = await isAuthenticated();
  if (!isAllowed) redirect("/signin");

  return <div>{children}</div>;
}

export default ProtectedLayout;
