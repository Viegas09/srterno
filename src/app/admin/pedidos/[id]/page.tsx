import { prisma } from "@/lib/prisma";
import { formatarData, formatarMoeda } from "@/lib/format";
import { registrarPagamento } from "@/lib/actions";
import { StatusSelect } from "@/components/StatusSelect";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

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

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const linkAutopreenchimento = `${appUrl}/pedido/${pedido.autopreenchimentoToken}`;
  const qrCodeDataUrl = await QRCode.toDataURL(linkAutopreenchimento, { margin: 1, width: 200 });

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">
            Pedido #{pedido.numero} — {pedido.cliente.nome}
          </h1>
          <p className="text-sm text-neutral-500">{pedido.descricao ?? pedido.tipo}</p>
        </div>
        <StatusSelect pedidoId={pedido.id} status={pedido.status} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <section className="rounded-lg border border-neutral-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-medium text-neutral-500">Datas</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><span className="text-neutral-500">Retirada:</span> {formatarData(pedido.dataRetirada)}</p>
              <p><span className="text-neutral-500">Devolução:</span> {formatarData(pedido.dataDevolucao)}</p>
              <p><span className="text-neutral-500">1ª prova:</span> {formatarData(pedido.primeiraProva)}</p>
              <p><span className="text-neutral-500">2ª prova:</span> {formatarData(pedido.segundaProva)}</p>
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-neutral-500">
                Pessoas e medidas ({pedido.pessoas.length})
              </h2>
            </div>
            {pedido.pessoas.length === 0 && (
              <p className="text-sm text-neutral-500">
                Nenhuma medida preenchida ainda. Peça pro cliente escanear o QR ao lado, ou lance manualmente.
              </p>
            )}
            <div className="space-y-3">
              {pedido.pessoas.map((pessoa) => (
                <div key={pessoa.id} className="rounded-md border border-neutral-100 p-3 text-sm">
                  <p className="mb-2 font-medium">{pessoa.nome}</p>
                  <div className="grid grid-cols-4 gap-x-4 gap-y-1 text-neutral-600">
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
                    <span>Ajuste: {pessoa.ajuste ?? "—"}</span>
                    <span>Gravata: {pessoa.corGravata ?? "—"}</span>
                    <span>Sapato: {pessoa.sapatoNumero ?? "—"} {pessoa.sapatoCor ?? ""}</span>
                    <span>Suspensório: {pessoa.suspensorio ? "sim" : "não"}</span>
                    <span>Lenço: {pessoa.lenco ? "sim" : "não"}</span>
                    <span>Flor: {pessoa.flor ? "sim" : "não"}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-medium text-neutral-500">Pagamentos</h2>
            <div className="mb-4 divide-y divide-neutral-100">
              {pedido.pagamentos.map((pg) => (
                <div key={pg.id} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    {pg.tipo} · {pg.formaPagamento} · {formatarData(pg.pagoEm)}
                  </span>
                  <span className="font-medium">{formatarMoeda(Number(pg.valor))}</span>
                </div>
              ))}
              {pedido.pagamentos.length === 0 && (
                <p className="py-2 text-sm text-neutral-500">Nenhum pagamento registrado.</p>
              )}
            </div>

            <form action={registrarPagamento} className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="pedidoId" value={pedido.id} />
              <div>
                <label className="mb-1 block text-xs text-neutral-500">Tipo</label>
                <select name="tipo" className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm">
                  <option value="SINAL">Sinal</option>
                  <option value="SALDO">Saldo</option>
                  <option value="MULTA">Multa</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">Valor (R$)</label>
                <input
                  name="valor"
                  type="number"
                  step="0.01"
                  required
                  className="w-28 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-500">Forma</label>
                <select name="formaPagamento" className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm">
                  <option value="PIX">PIX</option>
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="DEBITO">Débito</option>
                  <option value="CREDITO">Crédito</option>
                </select>
              </div>
              <button
                type="submit"
                className="rounded-md bg-ink px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Registrar
              </button>
            </form>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
            <h2 className="mb-3 text-sm font-medium text-neutral-500">Financeiro</h2>
            <p className="flex justify-between py-1"><span>Total</span> <span>{formatarMoeda(Number(pedido.valorTotal))}</span></p>
            <p className="flex justify-between py-1"><span>Pago</span> <span>{formatarMoeda(totalPago)}</span></p>
            <p className="flex justify-between border-t border-neutral-100 py-1 pt-2 font-medium">
              <span>Saldo devedor</span> <span>{formatarMoeda(saldoDevedor)}</span>
            </p>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-4 text-center">
            <h2 className="mb-3 text-sm font-medium text-neutral-500">Autopreenchimento</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeDataUrl} alt="QR code de autopreenchimento" className="mx-auto" />
            <p className="mt-2 break-all text-xs text-neutral-500">{linkAutopreenchimento}</p>
            <p className="mt-2 text-xs text-neutral-500">
              {pedido.autopreenchimentoPreenchidoEm
                ? `Preenchido em ${formatarData(pedido.autopreenchimentoPreenchidoEm)}`
                : "O cliente ainda não preencheu os dados dele."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
