import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/financeiro", label: "Financeiro" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r border-neutral-200 bg-white px-4 py-6">
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
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
