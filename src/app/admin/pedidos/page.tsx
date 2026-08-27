import { prisma } from "@/lib/prisma";
import { formatarData, formatarMoeda, STATUS_LABEL, STATUS_COLOR } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { createdAt: "desc" },
    include: { cliente: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Pedidos</h1>
        <Link
          href="/admin/pedidos/novo"
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Novo pedido
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Retirada</th>
              <th className="px-4 py-3">Devolução</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {pedidos.map((p) => (
              <tr key={p.id} className="cursor-pointer hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/pedidos/${p.id}`} className="block">
                    {p.numero}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/pedidos/${p.id}`} className="block font-medium">
                    {p.cliente.nome}
                  </Link>
                </td>
                <td className="px-4 py-3">{p.tipo}</td>
                <td className="px-4 py-3">{formatarData(p.dataRetirada)}</td>
                <td className="px-4 py-3">{formatarData(p.dataDevolucao)}</td>
                <td className="px-4 py-3">{formatarMoeda(Number(p.valorTotal))}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${STATUS_COLOR[p.status]}`}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                  Nenhum pedido cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
