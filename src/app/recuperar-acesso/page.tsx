import { recuperarAcesso } from "@/lib/actions";
import { buttonClass, inputClass, labelClass } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function RecuperarAcessoPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; erro?: string }>;
}) {
  const { token, erro } = await searchParams;

  if (token !== process.env.SETUP_TOKEN) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-center">
        <p className="text-sm text-paper/60">Link inválido.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-3xl font-semibold text-gold-soft">Sr. Terno</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-paper/40">
            Recuperar acesso de admin master
          </p>
        </div>

        <form
          action={recuperarAcesso}
          className="space-y-4 rounded-xl border border-leather bg-ink-soft p-6 shadow-card"
        >
          <input type="hidden" name="token" value={token} />
          {erro && (
            <p className="rounded-lg bg-bordeaux/20 px-3 py-2 text-sm text-[#e6a5a5]">
              Não foi possível salvar. Confira os dados e tente de novo.
            </p>
          )}
          <p className="text-xs text-paper/45">
            Informe um e-mail — se já existir, a senha dele é trocada; se não existir, cria um
            admin master novo. De qualquer forma você já entra direto.
          </p>
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
            <label className={`${labelClass} text-paper/50`}>Nova senha (mínimo 8 caracteres)</label>
            <input
              name="senha"
              type="password"
              required
              minLength={8}
              className={`${inputClass} border-leather bg-ink text-paper placeholder:text-paper/30`}
            />
          </div>
          <button type="submit" className={`${buttonClass} w-full bg-gold text-ink hover:bg-gold-deep`}>
            Salvar e entrar
          </button>
        </form>
      </div>
    </div>
  );
}
