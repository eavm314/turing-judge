import { useState } from 'react';

export const useChange = <T>(value: T, onChange?: (current: T, prev?: T) => void) => {
  const [prev, setPrev] = useState<T>();
  if (prev !== value && onChange) {
    setPrev(value);
    onChange(value, prev);
  }
};
