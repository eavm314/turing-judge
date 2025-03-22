import { prisma } from "@/lib/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";

const prismaAdapter = PrismaAdapter(prisma);

//@ts-ignore
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