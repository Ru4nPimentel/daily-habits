export const generateProgressPercentage = (total: number, completed: number) =>
  Math.round((completed / total) * 100);
