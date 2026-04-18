import { type Role } from '@prisma/browser';

declare module 'next-auth' {
  export interface User {
    role: Role;
  }
}
