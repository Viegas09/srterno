import { login } from "@/lib/actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { buttonClass, inputClass, labelClass } from "@/components/ui";
import { Logo } from "@/components/Logo";

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
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <p className="mt-2 text-xs uppercase tracking-widest text-paper/40">Sistema interno</p>
        </div>

        <form action={login} className="space-y-4 rounded-xl border border-leather bg-ink-soft p-6 shadow-card">
          {erro && (
            <p className="rounded-lg bg-bordeaux/20 px-3 py-2 text-sm text-[#e6a5a5]">
              E-mail ou senha incorretos.
            </p>
          )}
          <div>
            <label className={`${labelClass} text-paper/50`}>E-mail</label>
            <input
              name="email"
              type="email"
              required
              autoFocus
              className={`${inputClass} border-leather bg-ink text-paper placeholder:text-paper/30`}
            />
          </div>
          <div>
            <label className={`${labelClass} text-paper/50`}>Senha</label>
            <input
              name="senha"
              type="password"
              required
              className={`${inputClass} border-leather bg-ink text-paper placeholder:text-paper/30`}
            />
          </div>
          <button type="submit" className={`${buttonClass} w-full bg-gold text-ink hover:bg-gold-deep`}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
