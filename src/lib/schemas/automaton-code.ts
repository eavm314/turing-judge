export const validateCode = (code: string) => {
  try {
    JSON.parse(code);
    return "";
  } catch (error) {
    return "Invalid JSON format";
  }
};
