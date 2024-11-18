export const handleFormatDate = (value: string | Date): string => {
  // Expressão regular para validar formato ISO 8601 básico
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

  // Verifica se o valor é uma string no formato ISO
  if (typeof value === 'string' && isoRegex.test(value)) {
    const date = new Date(value); // Converte para objeto Date
    if (!isNaN(date.getTime())) { // Verifica se a data é válida
      return new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).format(date);
    }
  }

  // Se não for uma data válida, retorna o valor como string
  return String(value);
};
