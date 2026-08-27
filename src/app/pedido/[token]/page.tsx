import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { adicionarPessoaAoPedido } from "@/lib/actions";
import { formatarData } from "@/lib/format";

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
    <div className="mx-auto min-h-screen max-w-lg bg-paper px-4 py-10">
      <div className="mb-8 text-center">
        <p className="font-serif text-2xl font-semibold">Sr. Terno</p>
        <p className="text-sm text-neutral-600">
          Preencha seus dados e medidas para o pedido de {pedido.cliente.nome}
        </p>
        {pedido.dataRetirada && (
          <p className="mt-1 text-xs text-neutral-500">Retirada prevista: {formatarData(pedido.dataRetirada)}</p>
        )}
      </div>

      {pedido.pessoas.length > 0 && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {pedido.pessoas.length} pessoa(s) já preencheram os dados deste pedido. Você pode adicionar mais uma pessoa
          abaixo (ex.: outro padrinho) ou avisar a loja se já preencheu.
        </div>
      )}

      <form action={adicionarPessoa} className="space-y-5">
        <Campo label="Nome completo" name="nome" required />
        <Campo label="CPF" name="cpf" />

        <fieldset className="rounded-lg border border-neutral-200 p-4">
          <legend className="px-1 text-sm font-medium text-neutral-600">Medidas</legend>
          <div className="grid grid-cols-2 gap-3">
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

        <fieldset className="rounded-lg border border-neutral-200 p-4">
          <legend className="px-1 text-sm font-medium text-neutral-600">Ajustes e acessórios</legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-neutral-500">Ajuste</label>
              <select name="ajuste" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm">
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
              <label className="mb-1 block text-xs text-neutral-500">Cor do sapato</label>
              <select name="sapatoCor" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm">
                <option value="">—</option>
                <option value="PRETO">Preto</option>
                <option value="MARROM">Marrom</option>
              </select>
            </div>
            <Campo label="Número do anel" name="numeroAnel" />
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <Checkbox label="Suspensório" name="suspensorio" />
            <Checkbox label="Lenço" name="lenco" />
            <Checkbox label="Flor" name="flor" />
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-md bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Enviar meus dados
        </button>
      </form>
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
      <label className="mb-1 block text-xs text-neutral-500">{label}</label>
      <input
        name={name}
        required={required}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
    </div>
  );
}

function Checkbox({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" name={name} className="h-4 w-4 rounded border-neutral-300" />
      {label}
    </label>
  );
}
