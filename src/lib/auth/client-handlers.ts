import { revalidateAll, signIn, signOut } from '@/actions/auth';

export const handleSignIn = (provider?: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = await signIn(provider || 'google', {
        redirect: false,
        redirectTo: '/signin',
      });
      const popup = window.open(url as string, 'Sign In', 'width=480,height=600,top=100,left=460');
      popup?.focus();
      const checkPopupClosed = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopupClosed);
          revalidateAll();
          resolve(0);
        }
      }, 500);
    } catch (error) {
      console.error('Error opening sign-in popup:', error);
      reject(error);
    }
  });
};

export const handleSignOut = () => signOut();
