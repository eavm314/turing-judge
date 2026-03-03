import { useEffect } from 'react';

export const useFirstRender = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []);
};
