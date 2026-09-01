import { prisma } from "@/lib/prisma";
import { formatarData, COMO_CONHECEU_LABEL } from "@/lib/format";
import { Card, EmptyState, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { pedidos: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle={clientes.length === 1 ? "1 cadastrado" : `${clientes.length} cadastrados`}
      />

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-xs font-medium uppercase tracking-wide text-ink/45">
            <tr>
              <th className="px-5 py-3">Nome</th>
              <th className="px-5 py-3">CPF</th>
              <th className="px-5 py-3">Telefone</th>
              <th className="px-5 py-3">Como conheceu</th>
              <th className="px-5 py-3">Pedidos</th>
              <th className="px-5 py-3">Cliente desde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {clientes.map((c) => (
              <tr key={c.id} className="transition hover:bg-paper">
                <td className="px-5 py-3.5 font-medium text-ink">{c.nome}</td>
                <td className="px-5 py-3.5 text-ink/70">{c.cpf}</td>
                <td className="px-5 py-3.5 text-ink/70">{c.telefone ?? "—"}</td>
                <td className="px-5 py-3.5 text-ink/70">
                  {c.comoConheceu ? COMO_CONHECEU_LABEL[c.comoConheceu] : "—"}
                </td>
                <td className="px-5 py-3.5 text-ink/70">{c._count.pedidos}</td>
                <td className="px-5 py-3.5 text-ink/70">{formatarData(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {clientes.length === 0 && (
          <EmptyState>
            Nenhum cliente cadastrado ainda. Clientes são criados automaticamente ao abrir um novo pedido.
          </EmptyState>
        )}
      </Card>
    </div>
  );
}
