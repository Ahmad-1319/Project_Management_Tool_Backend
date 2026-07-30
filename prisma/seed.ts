import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@projecttool.dev" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@projecttool.dev",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const member = await prisma.user.upsert({
    where: { email: "member@projecttool.dev" },
    update: {},
    create: {
      name: "John Doe",
      email: "member@projecttool.dev",
      password: hashedPassword,
      role: "USER",
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "Collaborative Tool MVP",
      description: "Build an enterprise-grade Next.js 15+ project management tool.",
      ownerId: admin.id,
      members: {
        create: [
          { userId: admin.id, role: "OWNER" },
          { userId: member.id, role: "MEMBER" },
        ],
      },
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Design System Tokens Setup",
        description: "Configure Tailwind CSS v4 variables in globals.css",
        status: "TODO",
        priority: "HIGH",
        position: 1000,
        projectId: project.id,
        createdById: admin.id,
        assigneeId: member.id,
      },
      {
        title: "Prisma ORM Schema Modeling",
        description: "Define User, Project, Task, Comment, Notification models with indices.",
        status: "IN_PROGRESS",
        priority: "URGENT",
        position: 1000,
        projectId: project.id,
        createdById: admin.id,
        assigneeId: admin.id,
      },
      {
        title: "Auth Route Protection",
        description: "Configure NextAuth middleware for protected dashboard routes.",
        status: "DONE",
        priority: "HIGH",
        position: 1000,
        projectId: project.id,
        createdById: admin.id,
      },
    ],
  });

  console.log("✅ Database seeded successfully");
  console.log(`  → Admin: admin@projecttool.dev / Password123!`);
  console.log(`  → Member: member@projecttool.dev / Password123!`);
  console.log(`  → Project: ${project.name} (ID: ${project.id})`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
