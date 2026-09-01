import { criarCheckin } from "@/lib/actions";
import { buttonClass, inputClass, labelClass } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function RecepcaoPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; nome?: string }>;
}) {
  const { ok, nome } = await searchParams;

  if (ok === "1") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4 text-center">
        <div>
          <p className="font-serif text-3xl font-semibold text-ink">Sr. Terno</p>
          <div className="mx-auto mt-2 h-px w-10 bg-gold" />
          <p className="mt-6 font-serif text-xl font-semibold text-ink">
            Prontinho{nome ? `, ${nome}` : ""}!
          </p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Seus dados foram registrados. Pegue sua senha na entrada e aguarde ser chamado(a).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="mb-8 text-center">
          <p className="font-serif text-3xl font-semibold text-ink">Sr. Terno</p>
          <div className="mx-auto mt-2 h-px w-10 bg-gold" />
          <p className="mt-4 text-sm text-ink/60">
            Bem-vindo! Preencha seus dados antes de ser atendido(a).
          </p>
        </div>

        <form action={criarCheckin} className="space-y-4 rounded-xl border border-line bg-card p-5 shadow-card">
          <div>
            <label className={labelClass}>Nome completo</label>
            <input name="nome" required autoFocus className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>CPF</label>
            <input name="cpf" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Telefone</label>
            <input name="telefone" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>E-mail</label>
            <input name="email" type="email" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Como conheceu a loja?</label>
            <select name="comoConheceu" className={inputClass}>
              <option value="">—</option>
              <option value="GOOGLE">Google</option>
              <option value="REDE_SOCIAL">Rede social</option>
              <option value="INDICACAO">Indicação</option>
              <option value="OUTROS">Outros</option>
            </select>
          </div>
          <button type="submit" className={`${buttonClass} w-full py-3.5`}>
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}
