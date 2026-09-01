import { criarPedidoComCliente } from "@/lib/actions";
import { PageHeader, SectionTitle, buttonClass, inputClass, labelClass } from "@/components/ui";

export default function NovoPedidoPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Novo pedido" />

      <form action={criarPedidoComCliente} className="space-y-6">
        <section className="rounded-xl border border-line bg-card p-5 shadow-card">
          <SectionTitle>Cliente responsável</SectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Campo label="Nome" name="nome" required />
            <Campo label="CPF" name="cpf" required />
            <Campo label="Telefone" name="telefone" />
            <Campo label="E-mail" name="email" />
            <Campo label="Endereço" name="endereco" className="col-span-2" />
            <Campo label="Cidade" name="cidade" />
            <Campo label="CEP" name="cep" />
            <div>
              <label className={labelClass}>Como conheceu</label>
              <select name="comoConheceu" className={inputClass}>
                <option value="">—</option>
                <option value="GOOGLE">Google</option>
                <option value="REDE_SOCIAL">Rede social</option>
                <option value="INDICACAO">Indicação</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-line bg-card p-5 shadow-card">
          <SectionTitle>Pedido</SectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Tipo</label>
              <select name="tipo" className={inputClass}>
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

        <button type="submit" className={buttonClass}>
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
      <label className={labelClass}>{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        step={step}
        className={inputClass}
      />
    </div>
  );
}
