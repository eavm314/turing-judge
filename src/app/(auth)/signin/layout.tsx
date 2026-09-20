import type { Metadata } from 'next';

import { APP_NAME } from '@/constants/app';

export const metadata: Metadata = {
  title: 'Sign In',
  description: `Sign in to ${APP_NAME} to save your automata, submit solutions and track your progress.`,
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
