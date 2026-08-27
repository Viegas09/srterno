import { prisma } from "@/lib/prisma";
import { formatarData } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { pedidos: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold">Clientes</h1>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">CPF</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Como conheceu</th>
              <th className="px-4 py-3">Pedidos</th>
              <th className="px-4 py-3">Cliente desde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {clientes.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.nome}</td>
                <td className="px-4 py-3">{c.cpf}</td>
                <td className="px-4 py-3">{c.telefone ?? "—"}</td>
                <td className="px-4 py-3">{c.comoConheceu ?? "—"}</td>
                <td className="px-4 py-3">{c._count.pedidos}</td>
                <td className="px-4 py-3">{formatarData(c.createdAt)}</td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  Nenhum cliente cadastrado ainda. Clientes são criados automaticamente ao abrir um novo pedido.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
