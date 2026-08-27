export function formatarMoeda(valor: number | string) {
  const numero = typeof valor === "string" ? Number(valor) : valor;
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarData(data: Date | string | null | undefined) {
  if (!data) return "—";
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleDateString("pt-BR");
}

export const STATUS_LABEL: Record<string, string> = {
  RASCUNHO: "Rascunho",
  AGUARDANDO_AUTOPREENCHIMENTO: "Aguardando cliente",
  CONFIRMADO: "Confirmado",
  EM_AJUSTE: "Em ajuste",
  PRONTO_RETIRADA: "Pronto p/ retirada",
  RETIRADO: "Retirado",
  DEVOLVIDO: "Devolvido",
  CANCELADO: "Cancelado",
  ATRASADO: "Atrasado",
};

export const STATUS_COLOR: Record<string, string> = {
  RASCUNHO: "bg-neutral-200 text-neutral-700",
  AGUARDANDO_AUTOPREENCHIMENTO: "bg-amber-100 text-amber-800",
  CONFIRMADO: "bg-blue-100 text-blue-800",
  EM_AJUSTE: "bg-purple-100 text-purple-800",
  PRONTO_RETIRADA: "bg-emerald-100 text-emerald-800",
  RETIRADO: "bg-teal-100 text-teal-800",
  DEVOLVIDO: "bg-neutral-800 text-white",
  CANCELADO: "bg-red-100 text-red-800",
  ATRASADO: "bg-red-600 text-white",
};
