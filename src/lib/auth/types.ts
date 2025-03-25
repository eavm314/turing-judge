import { type Role } from "@prisma/client";

declare module "next-auth" {
  export interface User {
    role: Role;
  }
}