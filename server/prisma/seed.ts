import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";

import prisma from "../src/lib/prismaClient";

const main = async () => {
  try {
    const hashPassword = await hash("cneucrS1", 12);

    for (let i = 0; i < 10; i++) {
      await prisma.$transaction(async (prisma) => {
        const newUser = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: hashPassword,
          imageUrl: faker.image.avatar(),
        };

        const user = await prisma.user.create({ data: newUser });

        const newPost = {
          content: faker.word.words(),
          imageUrl: faker.image.url(),
          author: { connect: { id: user.id } },
        };

        const post = await prisma.post.create({ data: newPost });

        const newLike = {
          user: { connect: { id: user.id } },
          post: { connect: { id: post.id } },
        };

        await prisma.like.create({ data: newLike });

        const newComment = {
          content: faker.word.words(),
          author: { connect: { id: user.id } },
          post: { connect: { id: post.id } },
        };

        await prisma.comment.create({ data: newComment });
      });
    }

    console.log("Successfully seeded the database");
  } catch (error) {
    console.error("Error seeding database: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

main().catch((e) => console.error(e));
