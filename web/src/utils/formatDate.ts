const formatDate = (date: Date): string => {
  const dateFormated = new Date(date);
  return dateFormated.toLocaleDateString('pt-BR');
};

export default formatDate;
