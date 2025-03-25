import { prisma } from "@/lib/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";

const prismaAdapter = PrismaAdapter(prisma);

//@ts-expect-error: Overriding the createUser method
prismaAdapter.createUser = (data) => {
  return prisma.user.create({
    data: {
      email: data.email,
      image: data.image,
      name: data.name,
      role: Role.USER,
    },
  });
};

export default prismaAdapter;