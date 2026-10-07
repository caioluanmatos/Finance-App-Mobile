import { apiFetch } from "./api";

export interface Perfil {
  id: number;
  nome: string;
  email: string;
}

export async function buscarPerfil() {
  return apiFetch<Perfil>("/perfil");
}

export interface AlterarSenhaDados {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

export async function alterarSenha(dados: AlterarSenhaDados) {
  return apiFetch<{ mensagem: string }>("/perfil/senha", {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}