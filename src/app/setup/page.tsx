import { prisma } from "@/lib/prisma";
import { criarPrimeiroAdmin } from "@/lib/actions";
import { buttonClass, inputClass, labelClass } from "@/components/ui";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; erro?: string }>;
}) {
  const { token, erro } = await searchParams;
  const totalUsuarios = await prisma.usuario.count();

  if (totalUsuarios > 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-center">
        <div>
          <p className="font-serif text-xl font-semibold text-gold-soft">Configuração já concluída</p>
          <p className="mt-2 text-sm text-paper/60">
            Já existe pelo menos um usuário cadastrado. Acesse{" "}
            <a href="/login" className="text-gold underline">
              /login
            </a>{" "}
            normalmente.
          </p>
        </div>
      </div>
    );
  }

  if (token !== process.env.SETUP_TOKEN) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-center">
        <p className="text-sm text-paper/60">Link inválido ou expirado.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <p className="mt-2 text-xs uppercase tracking-widest text-paper/40">
            Criar o primeiro usuário do sistema
          </p>
        </div>

        <form
          action={criarPrimeiroAdmin}
          className="space-y-4 rounded-xl border border-leather bg-ink-soft p-6 shadow-card"
        >
          <input type="hidden" name="token" value={token} />
          {erro && (
            <p className="rounded-lg bg-bordeaux/20 px-3 py-2 text-sm text-[#e6a5a5]">
              Não foi possível criar o usuário. Confira os dados e tente de novo.
            </p>
          )}
          <div>
            <label className={`${labelClass} text-paper/50`}>Nome</label>
            <input
              name="nome"
              required
              autoFocus
              className={`${inputClass} border-leather bg-ink text-paper placeholder:text-paper/30`}
            />
          </div>
          <div>
            <label className={`${labelClass} text-paper/50`}>E-mail</label>
            <input
              name="email"
              type="email"
              required
              className={`${inputClass} border-leather bg-ink text-paper placeholder:text-paper/30`}
            />
          </div>
          <div>
            <label className={`${labelClass} text-paper/50`}>Senha (mínimo 8 caracteres)</label>
            <input
              name="senha"
              type="password"
              required
              minLength={8}
              className={`${inputClass} border-leather bg-ink text-paper placeholder:text-paper/30`}
            />
          </div>
          <button type="submit" className={`${buttonClass} w-full bg-gold text-ink hover:bg-gold-deep`}>
            Criar usuário e entrar
          </button>
        </form>
      </div>
    </div>
  );
}
