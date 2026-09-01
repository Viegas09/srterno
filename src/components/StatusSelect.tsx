"use client";

import { STATUS_LABEL, STATUS_COLOR } from "@/lib/format";
import { atualizarStatusPedido } from "@/lib/actions";
import { useTransition } from "react";

export function StatusSelect({ pedidoId, status }: { pedidoId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => atualizarStatusPedido(pedidoId, e.target.value))}
      className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-medium shadow-card transition disabled:opacity-50 ${STATUS_COLOR[status]}`}
    >
      {Object.entries(STATUS_LABEL).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
