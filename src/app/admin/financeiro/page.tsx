import { prisma } from "@/lib/prisma";
import { formatarData, formatarMoeda } from "@/lib/format";

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
      <h1 className="mb-6 font-serif text-2xl font-semibold">Financeiro</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-xs text-neutral-500">Recebido este mês</p>
          <p className="mt-1 text-xl font-semibold">{formatarMoeda(totalRecebidoMes)}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="text-xs text-neutral-500">A receber (pedidos ativos)</p>
          <p className="mt-1 text-xl font-semibold">{formatarMoeda(totalAReceber)}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="mb-1 text-xs text-neutral-500">Recebido por forma de pagamento</p>
          <div className="space-y-0.5 text-sm">
            {Object.entries(porFormaPagamento).map(([forma, valor]) => (
              <p key={forma} className="flex justify-between">
                <span>{forma}</span>
                <span>{formatarMoeda(valor)}</span>
              </p>
            ))}
            {Object.keys(porFormaPagamento).length === 0 && <p className="text-neutral-500">—</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <section className="rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-4 py-3">
            <h2 className="font-medium">Pagamentos do mês</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {pagamentosMes.map((pg) => (
              <div key={pg.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{pg.pedido.cliente.nome}</p>
                  <p className="text-neutral-500">
                    {pg.tipo} · {pg.formaPagamento} · {formatarData(pg.pagoEm)}
                  </p>
                </div>
                <span>{formatarMoeda(Number(pg.valor))}</span>
              </div>
            ))}
            {pagamentosMes.length === 0 && (
              <p className="px-4 py-6 text-sm text-neutral-500">Nenhum pagamento este mês.</p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-4 py-3">
            <h2 className="font-medium">Pedidos com saldo devedor</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {pedidosComSaldoDevedor.map(({ pedido, totalPago }) => (
              <div key={pedido.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{pedido.cliente.nome}</p>
                  <p className="text-neutral-500">Pedido #{pedido.numero}</p>
                </div>
                <span className="font-medium text-red-600">
                  {formatarMoeda(Number(pedido.valorTotal) - totalPago)}
                </span>
              </div>
            ))}
            {pedidosComSaldoDevedor.length === 0 && (
              <p className="px-4 py-6 text-sm text-neutral-500">Nenhum saldo pendente.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
