export type TipoTransacao = "receita" | "despesa";

export interface Transacao {
  id: number | string;
  descricao: string;
  valor: number | string;
  tipo: TipoTransacao;
  data?: string;
  categoria?: string;
  created_at?: string;
}

export interface CriarTransacaoDTO {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  data?: string;
  categoria?: string;
}

export interface ApiResponse<T = unknown> {
  sucesso?: boolean;
  mensagem?: string;
  dados?: T;
}
