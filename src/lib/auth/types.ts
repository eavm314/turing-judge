import { type Role } from "@prisma/client";
import "@auth/core/types";

declare module "@auth/core/types" {
  export interface User {
    role: Role;
  }
}