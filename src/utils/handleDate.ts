export const handleFormatDate = (value: string | Date): string => {
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    // Formata a data no padrão brasileiro
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "numeric",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(date);
  }
  return String(value); // Retorna o valor original se não for uma data válida
};