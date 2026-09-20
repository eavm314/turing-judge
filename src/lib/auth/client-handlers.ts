import { revalidateAll, signIn, signOut } from '@/actions/auth';

export const handleSignIn = (provider?: string) => {
  const tab = window.open('about:blank', '_blank');

  return new Promise(async (resolve, reject) => {
    try {
      const url = await signIn(provider || 'google', {
        redirect: false,
        redirectTo: '/signin',
      });

      if (!tab) {
        window.location.href = url as string;
        return;
      }

      tab.location.href = url as string;
      tab.focus();

      const checkTabClosed = setInterval(() => {
        if (tab.closed) {
          clearInterval(checkTabClosed);
          revalidateAll();
          resolve(0);
        }
      }, 500);
    } catch (error) {
      console.error('Error opening sign-in tab:', error);
      tab?.close();
      reject(error);
    }
  });
};

export const handleSignOut = () => signOut();
