import { login } from "@/lib/actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/admin");

  const { erro } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-2xl font-semibold">Sr. Terno</p>
          <p className="text-sm text-neutral-500">Sistema interno</p>
        </div>

        <form action={login} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          {erro && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              E-mail ou senha incorretos.
            </p>
          )}
          <div>
            <label className="mb-1 block text-xs text-neutral-500">E-mail</label>
            <input
              name="email"
              type="email"
              required
              autoFocus
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Senha</label>
            <input
              name="senha"
              type="password"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
