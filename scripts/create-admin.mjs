// Cria (ou atualiza a senha de) um usuário admin do dashboard.
// Uso: node scripts/create-admin.mjs "Nome Sobrenome" email@exemplo.com senhaForte123
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const [, , nome, email, senha] = process.argv;

if (!nome || !email || !senha) {
  console.error("Uso: node scripts/create-admin.mjs \"Nome\" email@exemplo.com senha");
  process.exit(1);
}

if (senha.length < 8) {
  console.error("A senha precisa ter pelo menos 8 caracteres.");
  process.exit(1);
}

const prisma = new PrismaClient();

const senhaHash = await hash(senha, 12);

const usuario = await prisma.usuario.upsert({
  where: { email: email.toLowerCase() },
  update: { senhaHash, nome },
  create: { nome, email: email.toLowerCase(), senhaHash },
});

console.log(`Usuário pronto: ${usuario.email}`);

await prisma.$disconnect();
