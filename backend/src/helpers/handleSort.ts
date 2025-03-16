export const handleSort = (
  sortBy: string,
  defaultSort: { [key: string]: 'ASC' | 'DESC' },
) => {
  if (sortBy) {
    const [field, direction] = sortBy.split(':');
    return { [field]: direction.toUpperCase() as 'ASC' | 'DESC' };
  }
  return defaultSort;
};
