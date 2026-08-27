import { criarPedidoComCliente } from "@/lib/actions";

export default function NovoPedidoPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-serif text-2xl font-semibold">Novo pedido</h1>

      <form action={criarPedidoComCliente} className="space-y-6">
        <section className="rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-medium text-neutral-500">Cliente responsável</h2>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Nome" name="nome" required />
            <Campo label="CPF" name="cpf" required />
            <Campo label="Telefone" name="telefone" />
            <Campo label="E-mail" name="email" />
            <Campo label="Endereço" name="endereco" className="col-span-2" />
            <Campo label="Cidade" name="cidade" />
            <Campo label="CEP" name="cep" />
            <div>
              <label className="mb-1 block text-xs text-neutral-500">Como conheceu</label>
              <select name="comoConheceu" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm">
                <option value="">—</option>
                <option value="GOOGLE">Google</option>
                <option value="REDE_SOCIAL">Rede social</option>
                <option value="INDICACAO">Indicação</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-medium text-neutral-500">Pedido</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-neutral-500">Tipo</label>
              <select name="tipo" className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm">
                <option value="ALUGUEL">Aluguel</option>
                <option value="VENDA">Venda</option>
                <option value="SOB_MEDIDA">Sob medida</option>
              </select>
            </div>
            <Campo label="Descrição" name="descricao" placeholder="Ex: Terno para casamento" />
            <Campo label="Data de retirada" name="dataRetirada" type="date" />
            <Campo label="Data de devolução" name="dataDevolucao" type="date" />
            <Campo label="Valor total (R$)" name="valorTotal" type="number" step="0.01" required />
            <Campo label="Sinal pago agora (R$)" name="valorSinal" type="number" step="0.01" />
          </div>
        </section>

        <button
          type="submit"
          className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Criar pedido
        </button>
      </form>
    </div>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required,
  placeholder,
  step,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs text-neutral-500">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        step={step}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
