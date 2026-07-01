import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@betnando.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@betnando.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      balance: 100,
    },
  });

  const users = [
    { name: 'João Silva', email: 'joao@example.com' },
    { name: 'Maria Santos', email: 'maria@example.com' },
    { name: 'Pedro Costa', email: 'pedro@example.com' },
    { name: 'Ana Ferreira', email: 'ana@example.com' },
    { name: 'Carlos Oliveira', email: 'carlos@example.com' },
  ];

  const createdUsers = [];
  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        passwordHash: userPassword,
        balance: 100,
      },
    });
    createdUsers.push(user);
  }

  const group = await prisma.group.upsert({
    where: { inviteCode: 'TESTCODE' },
    update: {},
    create: {
      name: 'Amigos do Futebol',
      inviteCode: 'TESTCODE',
      adminId: admin.id,
    },
  });

  for (const user of [admin, ...createdUsers]) {
    await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId: group.id, userId: user.id } },
      update: {},
      create: { groupId: group.id, userId: user.id },
    });
  }

  console.log('Seed completed!');
  console.log(`Admin: admin@betnando.com / admin123`);
  console.log(`Users: joao@example.com / password123`);
  console.log(`Group invite code: TESTCODE`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
