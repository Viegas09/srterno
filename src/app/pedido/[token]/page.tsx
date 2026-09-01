import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { adicionarPessoaAoPedido } from "@/lib/actions";
import { formatarData } from "@/lib/format";
import { buttonClass, inputClass, labelClass } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AutopreenchimentoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const pedido = await prisma.pedido.findUnique({
    where: { autopreenchimentoToken: token },
    include: { cliente: true, pessoas: true },
  });

  if (!pedido) notFound();

  const adicionarPessoa = adicionarPessoaAoPedido.bind(null, pedido.id);

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="mb-8 text-center">
          <p className="font-serif text-3xl font-semibold text-ink">Sr. Terno</p>
          <div className="mx-auto mt-2 h-px w-10 bg-gold" />
          <p className="mt-4 text-sm text-ink/60">
            Preencha seus dados e medidas para o pedido de {pedido.cliente.nome}
          </p>
          {pedido.dataRetirada && (
            <p className="mt-1 text-xs text-ink/40">
              Retirada prevista: {formatarData(pedido.dataRetirada)}
            </p>
          )}
        </div>

        {pedido.pessoas.length > 0 && (
          <div className="mb-6 rounded-lg border border-[#c7d4bd] bg-[#dde6d6] p-4 text-sm text-[#3f5c34]">
            {pedido.pessoas.length} pessoa(s) já preencheram os dados deste pedido. Você pode adicionar
            mais uma pessoa abaixo (ex.: outro padrinho) ou avisar a loja se já preencheu.
          </div>
        )}

        <form action={adicionarPessoa} className="space-y-5">
          <div className="rounded-xl border border-line bg-card p-5 shadow-card">
            <div className="space-y-4">
              <Campo label="Nome completo" name="nome" required />
              <Campo label="CPF" name="cpf" />
            </div>
          </div>

          <fieldset className="rounded-xl border border-line bg-card p-5 shadow-card">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-gold-deep">
              Medidas
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Campo label="Paletó" name="paleto" />
              <Campo label="Colete" name="colete" />
              <Campo label="Calça" name="calca" />
              <Campo label="Cós" name="cos" />
              <Campo label="Camisa" name="camisa" />
              <Campo label="Manga" name="manga" />
              <Campo label="Cima" name="cima" />
              <Campo label="Barra" name="barra" />
              <Campo label="Panturrilha" name="panturrilha" />
              <Campo label="Cavalo" name="cavalo" />
            </div>
          </fieldset>

          <fieldset className="rounded-xl border border-line bg-card p-5 shadow-card">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-gold-deep">
              Ajustes e acessórios
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Ajuste</label>
                <select name="ajuste" className={inputClass}>
                  <option value="">—</option>
                  <option value="LISA">Lisa</option>
                  <option value="RIGOR">Rigor</option>
                  <option value="SLIM">Slim</option>
                  <option value="ITALIANA">Italiana</option>
                  <option value="BORDO">Bordô</option>
                </select>
              </div>
              <Campo label="Cor da gravata" name="corGravata" />
              <Campo label="Número do sapato" name="sapatoNumero" />
              <div>
                <label className={labelClass}>Cor do sapato</label>
                <select name="sapatoCor" className={inputClass}>
                  <option value="">—</option>
                  <option value="PRETO">Preto</option>
                  <option value="MARROM">Marrom</option>
                </select>
              </div>
              <Campo label="Número do anel" name="numeroAnel" />
            </div>
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-ink/75">
              <Checkbox label="Suspensório" name="suspensorio" />
              <Checkbox label="Lenço" name="lenco" />
              <Checkbox label="Flor" name="flor" />
            </div>
          </fieldset>

          <button type="submit" className={`${buttonClass} w-full py-3.5`}>
            Enviar meus dados
          </button>
        </form>
      </div>
    </div>
  );
}

function Campo({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input name={name} required={required} className={inputClass} />
    </div>
  );
}

function Checkbox({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" name={name} className="h-4 w-4 rounded border-line text-gold focus:ring-gold" />
      {label}
    </label>
  );
}
