import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verificarSessionToken } from "@/lib/auth";

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE.name)?.value;
  if (!token) return null;
  return verificarSessionToken(token);
}

/// Usado dentro de Server Actions que alteram dados — garante que não sejam
/// executadas sem sessão válida, mesmo se algum request pular o middleware.
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
