import { prisma } from "@/lib/prisma";
import { formatarMoeda, STATUS_LABEL, STATUS_COLOR, formatarData } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [pedidosAtivos, aguardandoCliente, pagamentosMes, proximasRetiradas] = await Promise.all([
    prisma.pedido.count({
      where: { status: { notIn: ["DEVOLVIDO", "CANCELADO"] } },
    }),
    prisma.pedido.count({ where: { status: "AGUARDANDO_AUTOPREENCHIMENTO" } }),
    prisma.pagamento.aggregate({
      _sum: { valor: true },
      where: {
        pagoEm: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.pedido.findMany({
      where: {
        dataRetirada: { gte: new Date() },
        status: { notIn: ["DEVOLVIDO", "CANCELADO"] },
      },
      orderBy: { dataRetirada: "asc" },
      take: 6,
      include: { cliente: true },
    }),
  ]);

  const totalAReceber = await prisma.pedido.aggregate({
    _sum: { valorTotal: true },
    where: { status: { notIn: ["DEVOLVIDO", "CANCELADO"] } },
  });

  const cards = [
    { label: "Pedidos ativos", value: pedidosAtivos },
    { label: "Aguardando cliente preencher", value: aguardandoCliente },
    { label: "Recebido este mês", value: formatarMoeda(Number(pagamentosMes._sum.valor ?? 0)) },
    { label: "Total em pedidos ativos", value: formatarMoeda(Number(totalAReceber._sum.valorTotal ?? 0)) },
  ];

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold">Visão geral</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-neutral-200 bg-white p-4">
            <p className="text-xs text-neutral-500">{c.label}</p>
            <p className="mt-1 text-xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-3">
          <h2 className="font-medium">Próximas retiradas</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {proximasRetiradas.length === 0 && (
            <p className="px-4 py-6 text-sm text-neutral-500">Nenhuma retirada agendada.</p>
          )}
          {proximasRetiradas.map((p) => (
            <Link
              key={p.id}
              href={`/admin/pedidos/${p.id}`}
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-neutral-50"
            >
              <div>
                <p className="font-medium">{p.cliente.nome}</p>
                <p className="text-neutral-500">{p.descricao ?? "Pedido"} · retirada em {formatarData(p.dataRetirada)}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs ${STATUS_COLOR[p.status]}`}>
                {STATUS_LABEL[p.status]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
