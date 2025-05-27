'use client';

import { useEffect } from 'react';

export const SetSection = ({ section }: { section: string }) => {
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('section', section);
    window.history.replaceState({}, '', url.toString());
  }, []);

  return null;
};
