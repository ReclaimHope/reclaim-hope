import { PrismaClient } from "../lib/generated/prisma/client";
import { INITIAL_CHILDREN } from "../lib/initial-children";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding children database...");
  for (const child of INITIAL_CHILDREN) {
    const existing = await prisma.child.findFirst({
      where: {
        firstName: child.firstName,
        lastName: child.lastName,
      },
    });

    if (!existing) {
      await prisma.child.create({
        data: {
          id: child.id,
          firstName: child.firstName,
          lastName: child.lastName,
          dateOfBirth: new Date(child.dateOfBirth),
          dream: child.dream,
          imageUrl: child.imageUrl,
          story: child.story,
        },
      });
      console.log(`Created child: ${child.firstName} ${child.lastName}`);
    } else {
      console.log(`Child already exists: ${child.firstName} ${child.lastName}`);
    }
  }
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
