import { prisma } from "@/lib/prisma";
import { criarPrimeiroAdmin } from "@/lib/actions";

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
      <div className="flex min-h-screen items-center justify-center bg-paper px-4 text-center">
        <div>
          <p className="font-serif text-xl font-semibold">Configuração já concluída</p>
          <p className="mt-2 text-sm text-neutral-600">
            Já existe pelo menos um usuário cadastrado. Acesse{" "}
            <a href="/login" className="underline">
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
      <div className="flex min-h-screen items-center justify-center bg-paper px-4 text-center">
        <p className="text-sm text-neutral-600">Link inválido ou expirado.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-2xl font-semibold">Sr. Terno</p>
          <p className="text-sm text-neutral-500">Criar o primeiro usuário do sistema</p>
        </div>

        <form action={criarPrimeiroAdmin} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
          <input type="hidden" name="token" value={token} />
          {erro && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              Não foi possível criar o usuário. Confira os dados e tente de novo.
            </p>
          )}
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Nome</label>
            <input
              name="nome"
              required
              autoFocus
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-500">E-mail</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Senha (mínimo 8 caracteres)</label>
            <input
              name="senha"
              type="password"
              required
              minLength={8}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Criar usuário e entrar
          </button>
        </form>
      </div>
    </div>
  );
}
