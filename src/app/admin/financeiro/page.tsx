import { prisma } from "@/lib/prisma";
import { formatarData, formatarMoeda, PAGAMENTO_TIPO_LABEL, FORMA_PAGAMENTO_LABEL } from "@/lib/format";
import { Card, EmptyState, PageHeader, StatCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [pagamentosMes, pedidosAtivos] = await Promise.all([
    prisma.pagamento.findMany({
      where: { pagoEm: { gte: inicioMes } },
      orderBy: { pagoEm: "desc" },
      include: { pedido: { include: { cliente: true } } },
    }),
    prisma.pedido.findMany({
      where: { status: { notIn: ["DEVOLVIDO", "CANCELADO"] } },
      include: { pagamentos: true, cliente: true },
    }),
  ]);

  const totalRecebidoMes = pagamentosMes.reduce((soma, p) => soma + Number(p.valor), 0);

  const porFormaPagamento = pagamentosMes.reduce<Record<string, number>>((acc, p) => {
    acc[p.formaPagamento] = (acc[p.formaPagamento] ?? 0) + Number(p.valor);
    return acc;
  }, {});

  const pedidosComSaldoDevedor = pedidosAtivos
    .map((p) => ({
      pedido: p,
      totalPago: p.pagamentos.reduce((soma, pg) => soma + Number(pg.valor), 0),
    }))
    .filter(({ pedido, totalPago }) => Number(pedido.valorTotal) - totalPago > 0);

  const totalAReceber = pedidosComSaldoDevedor.reduce(
    (soma, { pedido, totalPago }) => soma + (Number(pedido.valorTotal) - totalPago),
    0
  );

  return (
    <div>
      <PageHeader title="Financeiro" />

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard label="Recebido este mês" value={formatarMoeda(totalRecebidoMes)} />
        <StatCard label="A receber (pedidos ativos)" value={formatarMoeda(totalAReceber)} />
        <Card className="px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/45">
            Recebido por forma de pagamento
          </p>
          <div className="mt-2 space-y-1 text-sm">
            {Object.entries(porFormaPagamento).map(([forma, valor]) => (
              <p key={forma} className="flex justify-between text-ink/80">
                <span>{FORMA_PAGAMENTO_LABEL[forma] ?? forma}</span>
                <span className="font-medium">{formatarMoeda(valor)}</span>
              </p>
            ))}
            {Object.keys(porFormaPagamento).length === 0 && <p className="text-ink/40">—</p>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-serif text-lg font-semibold text-ink">Pagamentos do mês</h2>
          </div>
          <div className="divide-y divide-line">
            {pagamentosMes.map((pg) => (
              <div key={pg.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <div>
                  <p className="font-medium text-ink">{pg.pedido.cliente.nome}</p>
                  <p className="text-ink/50">
                    {PAGAMENTO_TIPO_LABEL[pg.tipo]} · {FORMA_PAGAMENTO_LABEL[pg.formaPagamento]} ·{" "}
                    {formatarData(pg.pagoEm)}
                  </p>
                </div>
                <span className="font-medium text-ink">{formatarMoeda(Number(pg.valor))}</span>
              </div>
            ))}
          </div>
          {pagamentosMes.length === 0 && <EmptyState>Nenhum pagamento este mês.</EmptyState>}
        </Card>

        <Card>
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-serif text-lg font-semibold text-ink">Pedidos com saldo devedor</h2>
          </div>
          <div className="divide-y divide-line">
            {pedidosComSaldoDevedor.map(({ pedido, totalPago }) => (
              <div key={pedido.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <div>
                  <p className="font-medium text-ink">{pedido.cliente.nome}</p>
                  <p className="text-ink/50">Pedido #{pedido.numero}</p>
                </div>
                <span className="font-medium text-bordeaux">
                  {formatarMoeda(Number(pedido.valorTotal) - totalPago)}
                </span>
              </div>
            ))}
          </div>
          {pedidosComSaldoDevedor.length === 0 && <EmptyState>Nenhum saldo pendente.</EmptyState>}
        </Card>
      </div>
    </div>
  );
}
