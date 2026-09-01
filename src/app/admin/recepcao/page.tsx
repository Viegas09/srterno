import { prisma } from "@/lib/prisma";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

function tempoDeEspera(desde: Date) {
  const minutos = Math.floor((Date.now() - desde.getTime()) / 60000);
  if (minutos < 1) return "agora mesmo";
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  return `${horas}h${String(minutos % 60).padStart(2, "0")}`;
}

export default async function RecepcaoAdminPage() {
  const fila = await prisma.pedido.findMany({
    where: { status: "AGUARDANDO_AUTOPREENCHIMENTO", pessoas: { none: {} } },
    orderBy: { createdAt: "asc" },
    include: { cliente: true },
  });

  return (
    <div>
      <PageHeader
        title="Fila de atendimento"
        subtitle={fila.length === 0 ? "Ninguém esperando" : `${fila.length} aguardando`}
      />

      <Card className="overflow-hidden">
        <div className="divide-y divide-line">
          {fila.map((p) => (
            <Link
              key={p.id}
              href={`/admin/pedidos/${p.id}`}
              className="flex items-center justify-between px-5 py-4 transition hover:bg-paper"
            >
              <div>
                <p className="font-medium text-ink">{p.cliente.nome}</p>
                <p className="text-sm text-ink/50">{p.cliente.telefone ?? p.cliente.cpf}</p>
              </div>
              <span className="text-sm text-ink/45">esperando há {tempoDeEspera(p.createdAt)}</span>
            </Link>
          ))}
        </div>
        {fila.length === 0 && (
          <EmptyState>
            Ninguém na fila agora. Assim que um cliente fizer check-in pelo QR da entrada, ele
            aparece aqui.
          </EmptyState>
        )}
      </Card>
    </div>
  );
}
