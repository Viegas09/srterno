import Link from "next/link";
import { getSession } from "@/lib/session";
import { logout } from "@/lib/actions";

const NAV = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/financeiro", label: "Financeiro" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col justify-between border-r border-neutral-200 bg-white px-4 py-6">
        <div>
          <div className="mb-8 px-2">
            <p className="font-serif text-lg font-semibold tracking-tight">Sr. Terno</p>
            <p className="text-xs text-neutral-500">Sistema interno</p>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-neutral-100 px-2 pt-4">
          {session && <p className="mb-2 truncate text-xs text-neutral-500">{session.nome}</p>}
          <form action={logout}>
            <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-800">
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
