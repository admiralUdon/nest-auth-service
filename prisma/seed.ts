import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Delete all data first to start with a clean slate
  await prisma.userRole.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  // Create roles
  const adminRole = await prisma.role.create({
    data: {
      tag: 'admin',
      title: 'Administrator',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      tag: 'user',
      title: 'User',
    },
  });

  // Create users
  const john = await prisma.user.create({
    data: {
      username: 'john.doe@example.com',
      name: 'John Doe',
      password: 'password',
      avatar: 'https://example.com/avatar1.png',
    },
  });

  const admin = await prisma.user.create({
    data: {
      username: 'admin@example.com',
      name: 'Administrator',
      password: 'password',
      avatar: 'https://example.com/avatar2.png',
    },
  });

  // Create user-role relationships
  await prisma.userRole.create({
    data: {
      userId: john.id,
      roleId: userRole.id,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: admin.id,
      roleId: userRole.id,
    },
  });

  console.log({ john, admin, adminRole, userRole });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });