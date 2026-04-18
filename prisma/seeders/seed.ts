import 'dotenv/config';
import { PrismaClient, Role, User } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import exampleProjects from '@/constants/example-projects';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function getAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminName = process.env.ADMIN_NAME || 'Admin';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail, role: Role.ADMIN },
  });

  if (existingAdmin?.email === adminEmail) {
    console.log(`Admin user with email ${adminEmail} already exists. Skipping admin creation.`);
    return existingAdmin;
  }

  if (existingAdmin) {
    await prisma.user.delete({ where: { id: existingAdmin.id } });
    console.log(`Deleted existing user with email ${adminEmail} to create new admin user.`);
  }

  const newAdminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin user created with email ${adminEmail}.`);
  return newAdminUser;
}

async function syncExampleProjects(adminUser: User) {
  // Remove any existing example projects that don't match the current list
  const existingProjects = await prisma.project.findMany({
    where: { userId: adminUser.id, isPublic: true },
    select: { id: true },
  });

  const existingProjectIds = new Set(existingProjects.map(p => p.id));
  const exampleProjectIds = new Set(exampleProjects.map(p => p.id));

  const projectIdsToRemove = existingProjectIds.difference(exampleProjectIds);

  await prisma.project.deleteMany({
    where: {
      id: { in: Array.from(projectIdsToRemove) },
    },
  });

  // Upsert example projects
  for (const project of exampleProjects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: { ...project, userId: adminUser.id, isPublic: true },
      create: { ...project, userId: adminUser.id, isPublic: true },
    });
  }
}

async function main() {
  const adminUser = await getAdminUser();

  await syncExampleProjects(adminUser);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
