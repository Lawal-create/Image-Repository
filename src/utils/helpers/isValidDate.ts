export const isValidDate = (date: string): boolean => {
  const parsedDate = Date.parse(date);
  return !isNaN(parsedDate);
};
