import { getSession } from "@/lib/session";
import { logout } from "@/lib/actions";
import { NavLink } from "@/components/NavLink";

const NAV_BASE = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/recepcao", label: "Fila de atendimento" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/clientes", label: "Clientes" },
];

const NAV_ADMIN = [
  { href: "/admin/financeiro", label: "Financeiro" },
  { href: "/admin/usuarios", label: "Usuários" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const nav = session?.role === "ADMIN" ? [...NAV_BASE, ...NAV_ADMIN] : NAV_BASE;

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto bg-ink px-4 py-6">
        <div>
          <div className="mb-10 px-2">
            <p className="font-serif text-2xl font-semibold tracking-tight text-gold-soft">Sr. Terno</p>
            <p className="text-xs uppercase tracking-widest text-paper/40">Sistema interno</p>
          </div>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-leather px-2 pt-4">
          {session && (
            <p className="mb-2 truncate text-xs text-paper/50">
              {session.nome} · {session.role === "ADMIN" ? "Admin" : "Atendente"}
            </p>
          )}
          <form action={logout}>
            <button type="submit" className="text-sm text-paper/50 transition hover:text-gold-soft">
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-10 py-10">{children}</main>
    </div>
  );
}
