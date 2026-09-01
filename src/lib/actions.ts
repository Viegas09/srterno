"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { criarSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { requireSession } from "@/lib/session";

/// Só funciona enquanto não existir nenhum usuário no banco (bootstrap do
/// primeiro deploy) e exige o SETUP_TOKEN — depois do primeiro usuário
/// criado, essa action sempre recusa.
export async function criarPrimeiroAdmin(formData: FormData) {
  const token = String(formData.get("token") || "");
  if (!process.env.SETUP_TOKEN || token !== process.env.SETUP_TOKEN) {
    redirect("/setup");
  }

  const totalUsuarios = await prisma.usuario.count();
  if (totalUsuarios > 0) {
    redirect("/login");
  }

  const nome = String(formData.get("nome") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const senha = String(formData.get("senha") || "");

  if (!nome || !email || senha.length < 8) {
    redirect(`/setup?token=${token}&erro=1`);
  }

  const senhaHash = await hash(senha, 12);
  const usuario = await prisma.usuario.create({ data: { nome, email, senhaHash } });

  const sessionToken = await criarSessionToken({ userId: usuario.id, email: usuario.email, nome: usuario.nome });
  const store = await cookies();
  store.set(SESSION_COOKIE.name, sessionToken, SESSION_COOKIE.options);

  redirect("/admin");
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const senha = String(formData.get("senha") || "");

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  const senhaValida = usuario ? await compare(senha, usuario.senhaHash) : false;

  if (!usuario || !senhaValida) {
    redirect("/login?erro=1");
  }

  const token = await criarSessionToken({ userId: usuario.id, email: usuario.email, nome: usuario.nome });
  const store = await cookies();
  store.set(SESSION_COOKIE.name, token, SESSION_COOKIE.options);

  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE.name);
  redirect("/login");
}

const clienteSchema = z.object({
  nome: z.string().min(2),
  cpf: z.string().min(11),
  telefone: z.string().optional(),
  email: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  cep: z.string().optional(),
  comoConheceu: z.enum(["GOOGLE", "REDE_SOCIAL", "INDICACAO", "OUTROS"]).optional(),
});

const checkinSchema = z.object({
  nome: z.string().min(2),
  cpf: z.string().min(11),
  telefone: z.string().optional(),
  email: z.string().optional(),
  comoConheceu: z.enum(["GOOGLE", "REDE_SOCIAL", "INDICACAO", "OUTROS"]).optional(),
});

/// Check-in público (QR fixo na entrada da loja). O cliente só informa os
/// próprios dados de contato — nunca medidas. Cria (ou atualiza, se já é
/// cliente) o registro e entra na fila de atendimento; a atendente completa
/// o resto (tipo, valor, medidas) depois de chamar e medir a pessoa.
export async function criarCheckin(formData: FormData) {
  const dados = checkinSchema.parse({
    nome: formData.get("nome"),
    cpf: String(formData.get("cpf") || "").replace(/\D/g, ""),
    telefone: formData.get("telefone") || undefined,
    email: formData.get("email") || undefined,
    comoConheceu: (formData.get("comoConheceu") as string) || undefined,
  });

  const clienteExistente = await prisma.cliente.findUnique({ where: { cpf: dados.cpf } });

  const cliente = clienteExistente
    ? await prisma.cliente.update({ where: { id: clienteExistente.id }, data: dados })
    : await prisma.cliente.create({ data: dados });

  await prisma.pedido.create({
    data: { clienteId: cliente.id, status: "AGUARDANDO_AUTOPREENCHIMENTO" },
  });

  revalidatePath("/admin/recepcao");
  redirect(`/recepcao?ok=1&nome=${encodeURIComponent(dados.nome)}`);
}

export async function criarPedidoComCliente(formData: FormData) {
  await requireSession();

  const cliente = clienteSchema.parse({
    nome: formData.get("nome"),
    cpf: String(formData.get("cpf")).replace(/\D/g, ""),
    telefone: formData.get("telefone") || undefined,
    email: formData.get("email") || undefined,
    endereco: formData.get("endereco") || undefined,
    cidade: formData.get("cidade") || undefined,
    cep: formData.get("cep") || undefined,
    comoConheceu: (formData.get("comoConheceu") as string) || undefined,
  });

  const tipo = (formData.get("tipo") as string) || "ALUGUEL";
  const descricao = (formData.get("descricao") as string) || undefined;
  const valorTotal = Number(formData.get("valorTotal") || 0);
  const valorSinal = Number(formData.get("valorSinal") || 0);
  const dataRetiradaStr = formData.get("dataRetirada") as string;
  const dataDevolucaoStr = formData.get("dataDevolucao") as string;

  const clienteExistente = await prisma.cliente.findUnique({ where: { cpf: cliente.cpf } });

  const clienteRegistro = clienteExistente
    ? await prisma.cliente.update({ where: { id: clienteExistente.id }, data: cliente })
    : await prisma.cliente.create({ data: cliente });

  const pedido = await prisma.pedido.create({
    data: {
      clienteId: clienteRegistro.id,
      tipo: tipo as any,
      descricao,
      valorTotal,
      valorSinal,
      dataRetirada: dataRetiradaStr ? new Date(dataRetiradaStr) : undefined,
      dataDevolucao: dataDevolucaoStr ? new Date(dataDevolucaoStr) : undefined,
      status: "AGUARDANDO_AUTOPREENCHIMENTO",
    },
  });

  revalidatePath("/admin/pedidos");
  redirect(`/admin/pedidos/${pedido.id}`);
}

export async function registrarPagamento(formData: FormData) {
  await requireSession();

  const pedidoId = formData.get("pedidoId") as string;
  const tipo = formData.get("tipo") as string;
  const valor = Number(formData.get("valor") || 0);
  const formaPagamento = formData.get("formaPagamento") as string;

  await prisma.pagamento.create({
    data: {
      pedidoId,
      tipo: tipo as any,
      valor,
      formaPagamento: formaPagamento as any,
    },
  });

  revalidatePath(`/admin/pedidos/${pedidoId}`);
  revalidatePath("/admin/financeiro");
}

export async function atualizarDadosPedido(pedidoId: string, formData: FormData) {
  await requireSession();

  const tipo = (formData.get("tipo") as string) || "ALUGUEL";
  const descricao = (formData.get("descricao") as string) || null;
  const valorTotal = Number(formData.get("valorTotal") || 0);
  const dataRetiradaStr = formData.get("dataRetirada") as string;
  const dataDevolucaoStr = formData.get("dataDevolucao") as string;

  await prisma.pedido.update({
    where: { id: pedidoId },
    data: {
      tipo: tipo as any,
      descricao,
      valorTotal,
      dataRetirada: dataRetiradaStr ? new Date(dataRetiradaStr) : null,
      dataDevolucao: dataDevolucaoStr ? new Date(dataDevolucaoStr) : null,
    },
  });

  revalidatePath(`/admin/pedidos/${pedidoId}`);
  revalidatePath("/admin/pedidos");
}

export async function atualizarStatusPedido(pedidoId: string, status: string) {
  await requireSession();
  await prisma.pedido.update({ where: { id: pedidoId }, data: { status: status as any } });
  revalidatePath(`/admin/pedidos/${pedidoId}`);
  revalidatePath("/admin/pedidos");
}

const pessoaSchema = z.object({
  nome: z.string().min(2),
  cpf: z.string().optional(),
  paleto: z.string().optional(),
  colete: z.string().optional(),
  calca: z.string().optional(),
  cos: z.string().optional(),
  camisa: z.string().optional(),
  manga: z.string().optional(),
  cima: z.string().optional(),
  barra: z.string().optional(),
  panturrilha: z.string().optional(),
  cavalo: z.string().optional(),
  ajuste: z.enum(["LISA", "RIGOR", "SLIM", "ITALIANA", "BORDO"]).optional(),
  corGravata: z.string().optional(),
  suspensorio: z.boolean().optional(),
  lenco: z.boolean().optional(),
  sapatoNumero: z.string().optional(),
  sapatoCor: z.enum(["PRETO", "MARROM"]).optional(),
  flor: z.boolean().optional(),
  numeroAnel: z.string().optional(),
});

/// Só a atendente lança medidas — o cliente nunca escreve nem edita essa
/// parte (ela digita olhando a pessoa na sua frente).
export async function adicionarPessoaAoPedido(pedidoId: string, formData: FormData) {
  await requireSession();

  const dados = pessoaSchema.parse({
    nome: formData.get("nome"),
    cpf: formData.get("cpf") || undefined,
    paleto: formData.get("paleto") || undefined,
    colete: formData.get("colete") || undefined,
    calca: formData.get("calca") || undefined,
    cos: formData.get("cos") || undefined,
    camisa: formData.get("camisa") || undefined,
    manga: formData.get("manga") || undefined,
    cima: formData.get("cima") || undefined,
    barra: formData.get("barra") || undefined,
    panturrilha: formData.get("panturrilha") || undefined,
    cavalo: formData.get("cavalo") || undefined,
    ajuste: (formData.get("ajuste") as string) || undefined,
    corGravata: formData.get("corGravata") || undefined,
    suspensorio: formData.get("suspensorio") === "on",
    lenco: formData.get("lenco") === "on",
    sapatoNumero: formData.get("sapatoNumero") || undefined,
    sapatoCor: (formData.get("sapatoCor") as string) || undefined,
    flor: formData.get("flor") === "on",
    numeroAnel: formData.get("numeroAnel") || undefined,
  });

  await prisma.pessoaPedido.create({ data: { pedidoId, ...dados } });
  await prisma.pedido.update({
    where: { id: pedidoId },
    data: { autopreenchimentoPreenchidoEm: new Date() },
  });

  revalidatePath(`/admin/pedidos/${pedidoId}`);
}
