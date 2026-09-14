/**
 * Formata um valor numérico para o padrão de moeda brasileiro (BRL).
 * Exemplo: 1250.9 -> "R$ 1.250,90"
 */
export function formatarMoeda(valor: number | string): string {
  const numero = typeof valor === "string" ? parseFloat(valor) : Number(valor);
  if (isNaN(numero)) {
    return "R$ 0,00";
  }

  const fixo = Math.abs(numero).toFixed(2);
  const [inteiro, decimal] = fixo.split(".");
  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const sinal = numero < 0 ? "- " : "";

  return `${sinal}R$ ${inteiroFormatado},${decimal}`;
}

/**
 * Formata uma string de data (ISO ou AAAA-MM-DD) para DD/MM/AAAA.
 * Exemplo: "2026-09-14" -> "14/09/2026"
 */
export function formatarData(dataStr?: string): string {
  if (!dataStr) return "";

  try {
    // Se for formato YYYY-MM-DD ou contiver T
    const apenasData = dataStr.split("T")[0];
    const partes = apenasData.split("-");

    if (partes.length === 3) {
      const [ano, mes, dia] = partes;
      return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${ano}`;
    }

    const d = new Date(dataStr);
    if (!isNaN(d.getTime())) {
      const dia = String(d.getDate()).padStart(2, "0");
      const mes = String(d.getMonth() + 1).padStart(2, "0");
      const ano = d.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }
  } catch {
    // Se falhar o parse, retorna o valor original
  }

  return dataStr;
}

/**
 * Retorna a data atual no formato YYYY-MM-DD para preenchimento de inputs.
 */
export function obterDataAtualISO(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}
