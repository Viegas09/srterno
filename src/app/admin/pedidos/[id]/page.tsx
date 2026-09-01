import { prisma } from "@/lib/prisma";
import {
  formatarData,
  formatarMoeda,
  AJUSTE_LABEL,
  COR_PECA_LABEL,
  TIPO_LABEL,
} from "@/lib/format";
import { registrarPagamento, atualizarDadosPedido, adicionarPessoaAoPedido } from "@/lib/actions";
import { StatusSelect } from "@/components/StatusSelect";
import { Card, SectionTitle, buttonClass, inputClass, labelClass } from "@/components/ui";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PedidoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: { cliente: true, pessoas: true, pagamentos: { orderBy: { pagoEm: "desc" } } },
  });

  if (!pedido) notFound();

  const totalPago = pedido.pagamentos.reduce((soma, p) => soma + Number(p.valor), 0);
  const saldoDevedor = Number(pedido.valorTotal) - totalPago;

  const atualizarDados = atualizarDadosPedido.bind(null, pedido.id);
  const adicionarPessoa = adicionarPessoaAoPedido.bind(null, pedido.id);

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gold-deep">
            Pedido #{pedido.numero}
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-ink">
            {pedido.cliente.nome}
          </h1>
          <p className="mt-1 text-sm text-ink/55">
            {pedido.cliente.telefone ?? pedido.cliente.cpf}
          </p>
        </div>
        <StatusSelect pedidoId={pedido.id} status={pedido.status} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-5">
            <SectionTitle>Dados do pedido</SectionTitle>
            <form action={atualizarDados} className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Tipo</label>
                <select name="tipo" defaultValue={pedido.tipo} className={inputClass}>
                  <option value="ALUGUEL">Aluguel</option>
                  <option value="VENDA">Venda</option>
                  <option value="SOB_MEDIDA">Sob medida</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Descrição</label>
                <input
                  name="descricao"
                  defaultValue={pedido.descricao ?? ""}
                  placeholder="Ex: Terno para casamento"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Data de retirada</label>
                <input
                  name="dataRetirada"
                  type="date"
                  defaultValue={pedido.dataRetirada?.toISOString().slice(0, 10)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Data de devolução</label>
                <input
                  name="dataDevolucao"
                  type="date"
                  defaultValue={pedido.dataDevolucao?.toISOString().slice(0, 10)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Valor total (R$)</label>
                <input
                  name="valorTotal"
                  type="number"
                  step="0.01"
                  defaultValue={Number(pedido.valorTotal)}
                  className={inputClass}
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className={buttonClass}>
                  Salvar dados do pedido
                </button>
              </div>
            </form>
          </Card>

          <Card className="p-5">
            <SectionTitle>Pessoas e medidas ({pedido.pessoas.length})</SectionTitle>
            {pedido.pessoas.length === 0 && (
              <p className="mt-3 text-sm text-ink/50">
                Nenhuma medida lançada ainda. Use o formulário abaixo enquanto atende a pessoa.
              </p>
            )}
            <div className="mt-3 space-y-3">
              {pedido.pessoas.map((pessoa) => (
                <div key={pessoa.id} className="rounded-lg border border-line bg-paper/60 p-4 text-sm">
                  <p className="mb-2 font-serif text-base font-semibold text-ink">{pessoa.nome}</p>
                  <div className="grid grid-cols-4 gap-x-4 gap-y-1.5 text-ink/65">
                    <span>Paletó: {pessoa.paleto ?? "—"}</span>
                    <span>Colete: {pessoa.colete ?? "—"}</span>
                    <span>Calça: {pessoa.calca ?? "—"}</span>
                    <span>Cós: {pessoa.cos ?? "—"}</span>
                    <span>Camisa: {pessoa.camisa ?? "—"}</span>
                    <span>Manga: {pessoa.manga ?? "—"}</span>
                    <span>Cima: {pessoa.cima ?? "—"}</span>
                    <span>Barra: {pessoa.barra ?? "—"}</span>
                    <span>Panturrilha: {pessoa.panturrilha ?? "—"}</span>
                    <span>Cavalo: {pessoa.cavalo ?? "—"}</span>
                    <span>Ajuste: {pessoa.ajuste ? AJUSTE_LABEL[pessoa.ajuste] : "—"}</span>
                    <span>Gravata: {pessoa.corGravata ?? "—"}</span>
                    <span>
                      Sapato: {pessoa.sapatoNumero ?? "—"}{" "}
                      {pessoa.sapatoCor ? COR_PECA_LABEL[pessoa.sapatoCor] : ""}
                    </span>
                    <span>Suspensório: {pessoa.suspensorio ? "sim" : "não"}</span>
                    <span>Lenço: {pessoa.lenco ? "sim" : "não"}</span>
                    <span>Flor: {pessoa.flor ? "sim" : "não"}</span>
                  </div>
                </div>
              ))}
            </div>

            <details className="mt-4 group">
              <summary className="cursor-pointer text-sm font-medium text-gold-deep">
                + Lançar medidas de uma pessoa
              </summary>
              <form action={adicionarPessoa} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nome completo</label>
                    <input name="nome" required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>CPF</label>
                    <input name="cpf" className={inputClass} />
                  </div>
                </div>

                <fieldset className="rounded-lg border border-line p-4">
                  <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-gold-deep">
                    Medidas
                  </legend>
                  <div className="mt-2 grid grid-cols-4 gap-3">
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

                <fieldset className="rounded-lg border border-line p-4">
                  <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-gold-deep">
                    Ajustes e acessórios
                  </legend>
                  <div className="mt-2 grid grid-cols-4 gap-3">
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
                    <Campo label="Nº sapato" name="sapatoNumero" />
                    <div>
                      <label className={labelClass}>Cor do sapato</label>
                      <select name="sapatoCor" className={inputClass}>
                        <option value="">—</option>
                        <option value="PRETO">Preto</option>
                        <option value="MARROM">Marrom</option>
                      </select>
                    </div>
                    <Campo label="Nº do anel" name="numeroAnel" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-5 text-sm text-ink/75">
                    <Checkbox label="Suspensório" name="suspensorio" />
                    <Checkbox label="Lenço" name="lenco" />
                    <Checkbox label="Flor" name="flor" />
                  </div>
                </fieldset>

                <button type="submit" className={buttonClass}>
                  Salvar medidas
                </button>
              </form>
            </details>
          </Card>

          <Card className="p-5">
            <SectionTitle>Pagamentos</SectionTitle>
            <div className="mb-4 mt-3 divide-y divide-line">
              {pedido.pagamentos.map((pg) => (
                <div key={pg.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-ink/70">
                    {pg.tipo} · {pg.formaPagamento} · {formatarData(pg.pagoEm)}
                  </span>
                  <span className="font-medium text-ink">{formatarMoeda(Number(pg.valor))}</span>
                </div>
              ))}
              {pedido.pagamentos.length === 0 && (
                <p className="py-2.5 text-sm text-ink/45">Nenhum pagamento registrado.</p>
              )}
            </div>

            <form action={registrarPagamento} className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="pedidoId" value={pedido.id} />
              <div>
                <label className={labelClass}>Tipo</label>
                <select name="tipo" className={`${inputClass} w-auto`}>
                  <option value="SINAL">Sinal</option>
                  <option value="SALDO">Saldo</option>
                  <option value="MULTA">Multa</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Valor (R$)</label>
                <input name="valor" type="number" step="0.01" required className={`${inputClass} w-28`} />
              </div>
              <div>
                <label className={labelClass}>Forma</label>
                <select name="formaPagamento" className={`${inputClass} w-auto`}>
                  <option value="PIX">PIX</option>
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="DEBITO">Débito</option>
                  <option value="CREDITO">Crédito</option>
                </select>
              </div>
              <button type="submit" className={buttonClass}>
                Registrar
              </button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 text-sm">
            <SectionTitle>Financeiro</SectionTitle>
            <div className="mt-3 space-y-1">
              <p className="flex justify-between py-1 text-ink/70">
                <span>Total</span> <span>{formatarMoeda(Number(pedido.valorTotal))}</span>
              </p>
              <p className="flex justify-between py-1 text-ink/70">
                <span>Pago</span> <span>{formatarMoeda(totalPago)}</span>
              </p>
              <p className="flex justify-between border-t border-line py-1 pt-2.5 font-medium text-ink">
                <span>Saldo devedor</span>
                <span className={saldoDevedor > 0 ? "text-bordeaux" : ""}>
                  {formatarMoeda(saldoDevedor)}
                </span>
              </p>
            </div>
          </Card>

          <Card className="p-5 text-sm">
            <SectionTitle>Cliente</SectionTitle>
            <div className="mt-3 space-y-1 text-ink/70">
              <p>{pedido.cliente.email ?? "—"}</p>
              <p>{pedido.cliente.endereco ?? "—"}</p>
              <p>{pedido.cliente.cidade ?? "—"}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input name={name} className={inputClass} />
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
