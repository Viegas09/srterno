export function formatarMoeda(valor: number | string) {
  const numero = typeof valor === "string" ? Number(valor) : valor;
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarData(data: Date | string | null | undefined) {
  if (!data) return "—";
  const d = typeof data === "string" ? new Date(data) : data;
  return d.toLocaleDateString("pt-BR");
}

export const AJUSTE_LABEL: Record<string, string> = {
  LISA: "Lisa",
  RIGOR: "Rigor",
  SLIM: "Slim",
  ITALIANA: "Italiana",
  BORDO: "Bordô",
};

export const COR_PECA_LABEL: Record<string, string> = {
  PRETO: "Preto",
  MARROM: "Marrom",
};

export const PAGAMENTO_TIPO_LABEL: Record<string, string> = {
  SINAL: "Sinal",
  SALDO: "Saldo",
  MULTA: "Multa",
  ESTORNO: "Estorno",
  OUTRO: "Outro",
};

export const FORMA_PAGAMENTO_LABEL: Record<string, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  DEBITO: "Débito",
  CREDITO: "Crédito",
};

export const COMO_CONHECEU_LABEL: Record<string, string> = {
  GOOGLE: "Google",
  REDE_SOCIAL: "Rede social",
  INDICACAO: "Indicação",
  OUTROS: "Outros",
};

export const TIPO_LABEL: Record<string, string> = {
  ALUGUEL: "Aluguel",
  VENDA: "Venda",
  SOB_MEDIDA: "Sob medida",
};

export const STATUS_LABEL: Record<string, string> = {
  RASCUNHO: "Rascunho",
  AGUARDANDO_AUTOPREENCHIMENTO: "Aguardando atendimento",
  CONFIRMADO: "Confirmado",
  EM_AJUSTE: "Em ajuste",
  PRONTO_RETIRADA: "Pronto p/ retirada",
  RETIRADO: "Retirado",
  DEVOLVIDO: "Devolvido",
  CANCELADO: "Cancelado",
  ATRASADO: "Atrasado",
};

/// Paleta alinhada à identidade visual (dourado/couro/bordô), evitando as
/// cores genéricas padrão do Tailwind.
export const STATUS_COLOR: Record<string, string> = {
  RASCUNHO: "bg-line/70 text-ink/60",
  AGUARDANDO_AUTOPREENCHIMENTO: "bg-gold-soft text-gold-deep",
  CONFIRMADO: "bg-[#dde6d6] text-[#3f5c34]",
  EM_AJUSTE: "bg-[#dde3e8] text-[#3d5566]",
  PRONTO_RETIRADA: "bg-[#3f5c34] text-white",
  RETIRADO: "bg-ink text-gold-soft",
  DEVOLVIDO: "bg-leather text-gold-soft",
  CANCELADO: "bg-bordeaux-soft text-bordeaux",
  ATRASADO: "bg-bordeaux text-white",
};
