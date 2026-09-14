import * as SecureStore from "expo-secure-store";

// URL base da API (compatível com Android Emulator 10.0.2.2 ou variável pública do Expo)
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000";

const TOKEN_KEY = "token";

/**
 * Recupera o token JWT do SecureStore com segurança.
 * Nunca imprime nem expõe o token.
 */
export async function obterToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Salva o token JWT no SecureStore.
 */
export async function salvarToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/**
 * Remove o token do SecureStore (logout).
 */
export async function removerToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // Silencia erro de deleção
  }
}

export interface ApiResponseResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  mensagem?: string;
}

/**
 * Utilitário centralizado para requisições HTTP seguras.
 * - Injeta JWT automaticamente via Authorization: Bearer TOKEN
 * - Trata erros de rede sem travar a aplicação
 * - Trata 401 e 403 de forma padronizada
 * - Nunca exibe nem loga o JWT
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponseResult<T>> {
  try {
    const token = await obterToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        status: response.status,
        data: null,
        mensagem:
          data?.mensagem ||
          "Sessão expirada ou não autorizada. Faça login novamente.",
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data,
        mensagem:
          data?.mensagem ||
          data?.erro ||
          `Erro na requisição (${response.status}).`,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: data as T,
      mensagem: data?.mensagem,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      mensagem:
        "Não foi possível conectar ao servidor. Verifique a sua conexão ou se o backend está ativo.",
    };
  }
}
