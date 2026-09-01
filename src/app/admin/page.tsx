import { prisma } from "@/lib/prisma";
import { formatarMoeda, STATUS_LABEL, STATUS_COLOR, formatarData } from "@/lib/format";
import { Card, PageHeader, StatCard, EmptyState } from "@/components/ui";
import { getSession } from "@/lib/session";
import Link from "next/link";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";

  const [pedidosAtivos, naFila, pagamentosMes, proximasRetiradas] = await Promise.all([
    prisma.pedido.count({
      where: { status: { notIn: ["DEVOLVIDO", "CANCELADO"] } },
    }),
    prisma.pedido.count({
      where: { status: "AGUARDANDO_AUTOPREENCHIMENTO", pessoas: { none: {} } },
    }),
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

  const cards: { label: string; value: ReactNode; href?: string }[] = [
    { label: "Pedidos ativos", value: pedidosAtivos },
    { label: "Na fila de atendimento", value: naFila, href: "/admin/recepcao" },
  ];

  if (isAdmin) {
    const totalAReceber = await prisma.pedido.aggregate({
      _sum: { valorTotal: true },
      where: { status: { notIn: ["DEVOLVIDO", "CANCELADO"] } },
    });
    cards.push(
      { label: "Recebido este mês", value: formatarMoeda(Number(pagamentosMes._sum.valor ?? 0)) },
      { label: "Total em pedidos ativos", value: formatarMoeda(Number(totalAReceber._sum.valorTotal ?? 0)) }
    );
  }

  return (
    <div>
      <PageHeader title="Visão geral" subtitle="Como está a loja hoje" />

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} href={c.href} />
        ))}
      </div>

      <Card>
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-serif text-lg font-semibold text-ink">Próximas retiradas</h2>
        </div>
        <div className="divide-y divide-line">
          {proximasRetiradas.length === 0 && (
            <EmptyState>Nenhuma retirada agendada.</EmptyState>
          )}
          {proximasRetiradas.map((p) => (
            <Link
              key={p.id}
              href={`/admin/pedidos/${p.id}`}
              className="flex items-center justify-between px-5 py-4 text-sm transition hover:bg-paper"
            >
              <div>
                <p className="font-medium text-ink">{p.cliente.nome}</p>
                <p className="text-ink/50">
                  {p.descricao ?? "Pedido"} · retirada em {formatarData(p.dataRetirada)}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[p.status]}`}>
                {STATUS_LABEL[p.status]}
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
