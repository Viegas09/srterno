import { prisma } from "@/lib/prisma";
import {
  formatarData,
  formatarMoeda,
  AJUSTE_LABEL,
  COR_PECA_LABEL,
  TIPO_LABEL,
} from "@/lib/format";
import { registrarPagamento } from "@/lib/actions";
import { StatusSelect } from "@/components/StatusSelect";
import { Card, SectionTitle, buttonClass, inputClass, labelClass } from "@/components/ui";
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
  const qrCodeDataUrl = await QRCode.toDataURL(linkAutopreenchimento, {
    margin: 1,
    width: 220,
    color: { dark: "#171310", light: "#fffdf8" },
  });

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
          <p className="mt-1 text-sm text-ink/55">{pedido.descricao ?? TIPO_LABEL[pedido.tipo]}</p>
        </div>
        <StatusSelect pedidoId={pedido.id} status={pedido.status} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-5">
            <SectionTitle>Datas</SectionTitle>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-ink/80">
              <p>
                <span className="text-ink/45">Retirada:</span> {formatarData(pedido.dataRetirada)}
              </p>
              <p>
                <span className="text-ink/45">Devolução:</span> {formatarData(pedido.dataDevolucao)}
              </p>
              <p>
                <span className="text-ink/45">1ª prova:</span> {formatarData(pedido.primeiraProva)}
              </p>
              <p>
                <span className="text-ink/45">2ª prova:</span> {formatarData(pedido.segundaProva)}
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>Pessoas e medidas ({pedido.pessoas.length})</SectionTitle>
            {pedido.pessoas.length === 0 && (
              <p className="mt-3 text-sm text-ink/50">
                Nenhuma medida preenchida ainda. Peça pro cliente escanear o QR ao lado, ou lance
                manualmente.
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

          <Card className="p-5 text-center">
            <SectionTitle>Autopreenchimento</SectionTitle>
            <div className="mx-auto mt-3 w-fit rounded-lg border border-line bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCodeDataUrl} alt="QR code de autopreenchimento" className="mx-auto" />
            </div>
            <p className="mt-3 break-all text-xs text-ink/45">{linkAutopreenchimento}</p>
            <p className="mt-2 text-xs font-medium text-ink/60">
              {pedido.autopreenchimentoPreenchidoEm
                ? `Preenchido em ${formatarData(pedido.autopreenchimentoPreenchidoEm)}`
                : "O cliente ainda não preencheu os dados dele."}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
