export const formatValue = (value: number): string => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return formatter.format(value);
};

export const revertFormattedValue = (value: string): number => {
  const formattedValue = value.split('R$')[1].trim().replace(',', '.');
  return Number(formattedValue);
};
