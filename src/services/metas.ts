import { apiFetch } from "./api";

export interface Meta {
  id: number;
  nome: string;
  valor_meta: number;
  valor_atual: number;
  usuario_id?: number;
  criado_em?: string;
}

export interface NovaMeta {
  nome: string;
  valor_meta: number;
  valor_atual?: number;
}

export async function listarMetas() {
  return apiFetch<Meta[]>("/metas");
}

export async function criarMeta(meta: NovaMeta) {
  return apiFetch<{ mensagem: string; metaId: number }>("/metas", {
    method: "POST",
    body: JSON.stringify(meta),
  });
}

export async function editarMeta(id: number, meta: NovaMeta) {
  return apiFetch<{ mensagem: string }>(`/metas/${id}`, {
    method: "PUT",
    body: JSON.stringify(meta),
  });
}

export async function excluirMeta(id: number) {
  return apiFetch<{ mensagem: string }>(`/metas/${id}`, {
    method: "DELETE",
  });
}
