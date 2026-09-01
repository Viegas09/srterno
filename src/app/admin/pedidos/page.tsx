import { prisma } from "@/lib/prisma";
import { formatarData, formatarMoeda, STATUS_LABEL, STATUS_COLOR, TIPO_LABEL } from "@/lib/format";
import { ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { createdAt: "desc" },
    include: { cliente: true },
  });

  return (
    <div>
      <PageHeader
        title="Pedidos"
        subtitle={`${pedidos.length} no total`}
        action={<ButtonLink href="/admin/pedidos/novo">Novo pedido</ButtonLink>}
      />

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-xs font-medium uppercase tracking-wide text-ink/45">
            <tr>
              <th className="px-5 py-3">#</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Retirada</th>
              <th className="px-5 py-3">Devolução</th>
              <th className="px-5 py-3">Valor</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pedidos.map((p) => (
              <tr key={p.id} className="transition hover:bg-paper">
                <td className="px-5 py-3.5 text-ink/50">
                  <Link href={`/admin/pedidos/${p.id}`} className="block">
                    {p.numero}
                  </Link>
                </td>
                <td className="px-5 py-3.5">
                  <Link href={`/admin/pedidos/${p.id}`} className="block font-medium text-ink">
                    {p.cliente.nome}
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-ink/70">{TIPO_LABEL[p.tipo]}</td>
                <td className="px-5 py-3.5 text-ink/70">{formatarData(p.dataRetirada)}</td>
                <td className="px-5 py-3.5 text-ink/70">{formatarData(p.dataDevolucao)}</td>
                <td className="px-5 py-3.5 text-ink/70">{formatarMoeda(Number(p.valorTotal))}</td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[p.status]}`}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pedidos.length === 0 && <EmptyState>Nenhum pedido cadastrado ainda.</EmptyState>}
      </Card>
    </div>
  );
}
