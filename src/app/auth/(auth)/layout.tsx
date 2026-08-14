import type { ReactNode } from "react";
import { getHandleAuthUseCase } from "../../../../modules/auth";
import { redirect } from "next/navigation";

export default async function AuthProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const handleAuthUseCase = getHandleAuthUseCase();

  if (await handleAuthUseCase.getSession()) redirect("/");

  return <>{children}</>;
}