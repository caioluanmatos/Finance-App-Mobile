import { apiFetch } from "./api";
import { CriarTransacaoDTO, Transacao } from "@/types/transacao";

/**
 * Busca todas as transações do usuário logado (GET /transacoes).
 */
export async function listarTransacoes(): Promise<{
  sucesso: boolean;
  transacoes: Transacao[];
  mensagem?: string;
  status: number;
}> {
  const res = await apiFetch<any>("/transacoes", {
    method: "GET",
  });

  if (!res.ok) {
    return {
      sucesso: false,
      transacoes: [],
      mensagem: res.mensagem || "Não foi possível carregar as transações.",
      status: res.status,
    };
  }

  let lista: Transacao[] = [];
  if (Array.isArray(res.data)) {
    lista = res.data;
  } else if (res.data && Array.isArray(res.data.transacoes)) {
    lista = res.data.transacoes;
  } else if (res.data && Array.isArray(res.data.dados)) {
    lista = res.data.dados;
  }

  return {
    sucesso: true,
    transacoes: lista,
    status: res.status,
  };
}

/**
 * Cria uma nova transação (POST /transacoes).
 */
export async function criarTransacao(dados: CriarTransacaoDTO): Promise<{
  sucesso: boolean;
  mensagem?: string;
  transacao?: Transacao;
  status: number;
}> {
  const payload: Record<string, any> = {
    descricao: dados.descricao.trim(),
    valor: Number(dados.valor),
    tipo: dados.tipo,
  };

  if (dados.data) {
    payload.data = dados.data;
  }

  if (dados.categoria && dados.categoria.trim()) {
    payload.categoria = dados.categoria.trim();
  }

  const res = await apiFetch<any>("/transacoes", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    sucesso: res.ok,
    mensagem: res.mensagem || (res.ok ? "Transação criada com sucesso!" : "Erro ao criar transação."),
    transacao: res.data,
    status: res.status,
  };
}

/**
 * Exclui uma transação (DELETE /transacoes/:id).
 * Se o endpoint não estiver habilitado no backend, retorna erro controlado.
 */
export async function excluirTransacao(id: number | string): Promise<{
  sucesso: boolean;
  mensagem?: string;
  status: number;
}> {
  const res = await apiFetch<any>(`/transacoes/${id}`, {
    method: "DELETE",
  });

  return {
    sucesso: res.ok,
    mensagem:
      res.mensagem ||
      (res.ok
        ? "Transação excluída com sucesso!"
        : "Não foi possível excluir a transação."),
    status: res.status,
  };
}


/**
 * Edita uma transação existente (PUT /transacoes/:id).
 */
export async function editarTransacao(
  id: number | string,
  dados: CriarTransacaoDTO
): Promise<{
  sucesso: boolean;
  mensagem?: string;
  status: number;
}> {
  const payload = {
    descricao: dados.descricao.trim(),
    valor: Number(dados.valor),
    tipo: dados.tipo,
    data: dados.data,
  };

  const res = await apiFetch<any>(
    `/transacoes/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

  return {
    sucesso: res.ok,
    mensagem:
      res.mensagem ||
      (res.ok
        ? "Transação editada com sucesso!"
        : "Não foi possível editar a transação."),
    status: res.status,
  };
}
