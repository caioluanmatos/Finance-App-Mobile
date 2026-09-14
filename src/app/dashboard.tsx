import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { obterToken, removerToken } from "@/services/api";
import { listarTransacoes } from "@/services/transacoes";
import { Transacao } from "@/types/transacao";
import { formatarData, formatarMoeda } from "@/utils/formatters";

export default function DashboardScreen() {
  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [transacoesRecentes, setTransacoesRecentes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function verificarToken() {
    const token = await obterToken();
    if (!token) {
      router.replace("/");
    }
  }

  const carregarDados = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setCarregando(true);
    }

    try {
      const token = await obterToken();
      if (!token) {
        router.replace("/");
        return;
      }

      const res = await listarTransacoes();

      if (!res.sucesso) {
        if (res.status === 401 || res.status === 403) {
          await removerToken();
          router.replace("/");
        }
        return;
      }

      const lista = res.transacoes;

      const totalReceitas = lista
        .filter((item) => item.tipo === "receita")
        .reduce((total, item) => total + Number(item.valor), 0);

      const totalDespesas = lista
        .filter((item) => item.tipo === "despesa")
        .reduce((total, item) => total + Number(item.valor), 0);

      setReceitas(totalReceitas);
      setDespesas(totalDespesas);
      setSaldo(totalReceitas - totalDespesas);
      // Pega até as 4 mais recentes
      setTransacoesRecentes(lista.slice(0, 4));
    } catch {
      // Erro silencioso para não quebrar UI
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      verificarToken();
      carregarDados();
    }, [carregarDados])
  );

  async function handleLogout() {
    await removerToken();
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => carregarDados(true)}
            tintColor="#6c5ce7"
            colors={["#6c5ce7"]}
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Bem-vindo ao Finance App 🚀</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogout}
            accessibilityLabel="Fazer logout"
          >
            <Ionicons name="log-out-outline" size={24} color="#ffffff" />
          </Pressable>
        </View>

        {/* CARDS DE RESUMO */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Saldo atual</Text>
            <Text style={styles.saldo}>
              {carregando && !refreshing ? "..." : formatarMoeda(saldo)}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.smallCard}>
              <View style={styles.badgeRow}>
                <Ionicons name="arrow-up-circle" size={16} color="#4ade80" />
                <Text style={styles.cardLabel}>Receitas</Text>
              </View>
              <Text style={styles.receitas}>
                {carregando && !refreshing ? "..." : formatarMoeda(receitas)}
              </Text>
            </View>

            <View style={styles.smallCard}>
              <View style={styles.badgeRow}>
                <Ionicons name="arrow-down-circle" size={16} color="#f87171" />
                <Text style={styles.cardLabel}>Despesas</Text>
              </View>
              <Text style={styles.despesas}>
                {carregando && !refreshing ? "..." : formatarMoeda(despesas)}
              </Text>
            </View>
          </View>
        </View>

        {/* ATALHOS DE AÇÃO RÁPIDA */}
        <View style={styles.acoesContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.acaoButtonPrincipal,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/nova-transacao")}
          >
            <Ionicons name="add-circle" size={20} color="#ffffff" />
            <Text style={styles.acaoButtonTextPrincipal}>Nova Transação</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.acaoButtonSecundario,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/transacoes")}
          >
            <Ionicons name="list" size={20} color="#6c5ce7" />
            <Text style={styles.acaoButtonTextSecundario}>Ver Transações</Text>
          </Pressable>
        </View>

        {/* SEÇÃO ÚLTIMAS TRANSAÇÕES */}
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Últimas Transações</Text>
          <Pressable onPress={() => router.push("/transacoes")}>
            <Text style={styles.verTodasLink}>Ver todas</Text>
          </Pressable>
        </View>

        {carregando && !refreshing ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#6c5ce7" />
          </View>
        ) : transacoesRecentes.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="receipt-outline" size={32} color="#8b8b9b" />
            <Text style={styles.emptyText}>Nenhuma transação recente.</Text>
          </View>
        ) : (
          <View style={styles.recentesLista}>
            {transacoesRecentes.map((item, index) => {
              const isReceita = item.tipo === "receita";
              return (
                <View
                  key={item.id ? String(item.id) : `recente-${index}`}
                  style={styles.recenteItem}
                >
                  <View style={styles.recenteLeft}>
                    <View
                      style={[
                        styles.recenteIconCircle,
                        isReceita
                          ? styles.recenteIconReceita
                          : styles.recenteIconDespesa,
                      ]}
                    >
                      <Ionicons
                        name={isReceita ? "arrow-up" : "arrow-down"}
                        size={16}
                        color={isReceita ? "#4ade80" : "#f87171"}
                      />
                    </View>

                    <View style={styles.recenteInfo}>
                      <Text style={styles.recenteDescricao} numberOfLines={1}>
                        {item.descricao}
                      </Text>
                      <Text style={styles.recenteData}>
                        {formatarData(item.data)}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.recenteValor,
                      isReceita ? styles.valorReceita : styles.valorDespesa,
                    ]}
                  >
                    {isReceita ? "+ " : "- "}
                    {formatarMoeda(item.valor)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080b18",
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    color: "#9ea3b7",
    fontSize: 15,
    marginTop: 6,
  },

  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1a1e32",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#292f4d",
  },

  buttonPressed: {
    opacity: 0.7,
  },

  cardsContainer: {
    marginTop: 28,
    gap: 16,
  },

  card: {
    backgroundColor: "#111528",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "#232945",
  },

  cardRow: {
    flexDirection: "row",
    gap: 16,
  },

  smallCard: {
    flex: 1,
    backgroundColor: "#111528",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#232945",
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  cardLabel: {
    color: "#9ea3b7",
    fontSize: 14,
  },

  saldo: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
  },

  receitas: {
    color: "#4ade80",
    fontSize: 20,
    fontWeight: "700",
  },

  despesas: {
    color: "#f87171",
    fontSize: 20,
    fontWeight: "700",
  },

  acoesContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },

  acaoButtonPrincipal: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#6c5ce7",
  },

  acaoButtonTextPrincipal: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  acaoButtonSecundario: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#1a1e32",
    borderWidth: 1,
    borderColor: "#292f4d",
  },

  acaoButtonTextSecundario: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  secaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
  },

  secaoTitulo: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  verTodasLink: {
    color: "#8b7cff",
    fontSize: 14,
    fontWeight: "600",
  },

  loadingBox: {
    paddingVertical: 24,
    alignItems: "center",
  },

  emptyBox: {
    backgroundColor: "#111528",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#232945",
    gap: 8,
  },

  emptyText: {
    color: "#9ea3b7",
    fontSize: 14,
  },

  recentesLista: {
    backgroundColor: "#111528",
    borderRadius: 18,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#232945",
  },

  recenteItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1e32",
  },

  recenteLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },

  recenteIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  recenteIconReceita: {
    backgroundColor: "#133827",
  },

  recenteIconDespesa: {
    backgroundColor: "#3b1d24",
  },

  recenteInfo: {
    flex: 1,
  },

  recenteDescricao: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  recenteData: {
    color: "#8b8b9b",
    fontSize: 12,
    marginTop: 2,
  },

  recenteValor: {
    fontSize: 14,
    fontWeight: "700",
  },

  valorReceita: {
    color: "#4ade80",
  },

  valorDespesa: {
    color: "#f87171",
  },
});