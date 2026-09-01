const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

export const generatePassword = (length = 12) => {
  const values = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(values, value => CHARSET[value % CHARSET.length]).join('');
};
