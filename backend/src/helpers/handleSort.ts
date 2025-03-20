export const handleSort = (sortBy: string) => {
  const [field, direction] = sortBy.split(':');
  return { [field]: direction.toUpperCase() as 'ASC' | 'DESC' };
};
