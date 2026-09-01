import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { criarUsuario } from "@/lib/actions";
import { Card, PageHeader, SectionTitle, buttonClass, inputClass, labelClass } from "@/components/ui";
import { formatarData } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  await requireAdmin();

  const usuarios = await prisma.usuario.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="max-w-2xl">
      <PageHeader title="Usuários" subtitle="Quem tem acesso ao sistema" />

      <Card className="mb-6 overflow-hidden">
        <div className="divide-y divide-line">
          {usuarios.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
              <div>
                <p className="font-medium text-ink">{u.nome}</p>
                <p className="text-ink/50">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    u.role === "ADMIN" ? "bg-gold-soft text-gold-deep" : "bg-line/70 text-ink/60"
                  }`}
                >
                  {u.role === "ADMIN" ? "Admin master" : "Atendente"}
                </span>
                <span className="text-xs text-ink/40">desde {formatarData(u.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle>Adicionar acesso</SectionTitle>
        <form action={criarUsuario} className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Nome</label>
            <input name="nome" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>E-mail</label>
            <input name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Senha (mínimo 8 caracteres)</label>
            <input name="senha" type="password" required minLength={8} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Papel</label>
            <select name="role" defaultValue="ATENDENTE" className={inputClass}>
              <option value="ATENDENTE">Atendente</option>
              <option value="ADMIN">Admin master</option>
            </select>
          </div>
          <div className="col-span-2">
            <button type="submit" className={buttonClass}>
              Criar acesso
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
