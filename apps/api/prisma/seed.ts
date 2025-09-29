import { faker } from '@faker-js/faker';
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

// import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function seed() {
  await prisma.member.deleteMany();
  await prisma.project.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("123456", 1);

  // Create users individually to get their IDs
  const user1 = await prisma.user.create({
    data: {
      name: "Pedro de Paula",
      email: "ppaula@email.com",
      avatarUrl: "https://github/pmdpaula.png",
      passwordHash: passwordHash,
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatar(),
      passwordHash: passwordHash,
    }
  });

  const user3 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatar(),
      passwordHash: passwordHash,
    }
  });

  await prisma.organization.create({
    data: {
      name: "Acme Inc. (Admin)",
      domain: "acme.br",
      slug: "acme-inc-admin",
      avatarUrl: faker.image.urlLoremFlickr({ category: 'business' }),
      shouldAttachUsersByDomain: true,
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            { name: faker.lorem.word(),
              slug: faker.lorem.word().toLowerCase(),
              description: faker.lorem.sentence(),
              avatarUrl: faker.image.urlLoremFlickr({ category: 'business' }),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            }
          ]
        }
      },
      members: {
        createMany: {
          data: [
            {
              userId: user1.id, role: "ADMIN"
            },
            {
              userId: user2.id,
              role: "MEMBER"
            },
            { userId: user3.id,
              role: "MEMBER"
            }
          ]
        }
      }
    }
  });

  await prisma.organization.create({
    data: {
      name: "Acme Inc. (Member)",
      slug: "acme-inc-member",
      avatarUrl: faker.image.urlLoremFlickr({ category: 'business' }),
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            { name: faker.lorem.word(),
              slug: faker.lorem.word().toLowerCase(),
              description: faker.lorem.sentence(),
              avatarUrl: faker.image.urlLoremFlickr({ category: 'business' }),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
            { name: faker.lorem.word(),
              slug: faker.lorem.word().toLowerCase(),
              description: faker.lorem.sentence(),
              avatarUrl: faker.image.urlLoremFlickr({ category: 'business' }),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
            { name: faker.lorem.word(),
              slug: faker.lorem.word().toLowerCase(),
              description: faker.lorem.sentence(),
              avatarUrl: faker.image.urlLoremFlickr({ category: 'business' }),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
          ]
        }
      },
      members: {
        createMany: {
          data: [
            {
              userId: user1.id, role: "MEMBER"
            },
            {
              userId: user2.id,
              role: "ADMIN"
            },
            { userId: user3.id,
              role: "MEMBER"
            }
          ]
        }
      }
    }
  });

  await prisma.organization.create({
    data: {
      name: "Acme Inc. (Billing)",
      slug: "acme-inc-billing",
      avatarUrl: faker.image.urlLoremFlickr({ category: 'business' }),
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            { name: faker.lorem.word(),
              slug: faker.lorem.word().toLowerCase(),
              description: faker.lorem.sentence(),
              avatarUrl: faker.image.urlLoremFlickr({ category: 'business' }),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
            { name: faker.lorem.word(),
              slug: faker.lorem.word().toLowerCase(),
              description: faker.lorem.sentence(),
              avatarUrl: faker.image.urlLoremFlickr({ category: 'business' }),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
            { name: faker.lorem.word(),
              slug: faker.lorem.word().toLowerCase(),
              description: faker.lorem.sentence(),
              avatarUrl: faker.image.urlLoremFlickr({ category: 'business' }),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id]),
            },
          ]
        }
      },
      members: {
        createMany: {
          data: [
            {
              userId: user1.id, role: "BILLING"
            },
            {
              userId: user2.id,
              role: "ADMIN"
            },
            { userId: user3.id,
              role: "MEMBER"
            }
          ]
        }
      }
    }

  });
}

seed().then(() => {
console.log('Seeding finished.');
  prisma.$disconnect();
});
