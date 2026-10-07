import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { excluirTransacao, listarTransacoes } from "@/services/transacoes";
import { TipoTransacao, Transacao } from "@/types/transacao";
import { formatarData, formatarMoeda } from "@/utils/formatters";

type FiltroTipo = "todas" | TipoTransacao;

export default function TransacoesScreen() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<FiltroTipo>("todas");
  const [excluindoId, setExcluindoId] = useState<number | string | null>(null);

  const carregar = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setCarregando(true);
    }
    setErro(null);

    const resultado = await listarTransacoes();

    if (resultado.sucesso) {
      setTransacoes(resultado.transacoes);
    } else {
      setErro(resultado.mensagem || "Erro ao buscar transações.");
      if (resultado.status === 401 || resultado.status === 403) {
        Alert.alert("Sessão Expirada", "Faça login novamente.", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      }
    }

    setCarregando(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function handleConfirmarExclusao(item: Transacao) {
    Alert.alert(
      "Excluir Transação",
      `Deseja realmente excluir "${item.descricao}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => executarExclusao(item.id),
        },
      ]
    );
  }

  async function executarExclusao(id: number | string) {
    setExcluindoId(id);
    const resultado = await excluirTransacao(id);
    setExcluindoId(null);

    if (resultado.sucesso) {
      Alert.alert("Sucesso", resultado.mensagem || "Transação excluída!");
      // Atualiza a lista localmente e recarrega
      setTransacoes((anteriores) => anteriores.filter((t) => t.id !== id));
    } else {
      Alert.alert("Atenção", resultado.mensagem || "Erro ao excluir transação.");
    }
  }

  const transacoesFiltradas = transacoes.filter((t) => {
    if (filtro === "todas") return true;
    return t.tipo === filtro;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/(tabs)/dashboard")}
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </Pressable>

        <Text style={styles.title}>Transações</Text>

        <Pressable
          style={({ pressed }) => [
            styles.novoButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/nova-transacao")}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.novoButtonText}>Nova</Text>
        </Pressable>
      </View>

      {/* FILTROS */}
      <View style={styles.filtrosContainer}>
        <Pressable
          style={[
            styles.filtroChip,
            filtro === "todas" && styles.filtroChipAtivo,
          ]}
          onPress={() => setFiltro("todas")}
        >
          <Text
            style={[
              styles.filtroText,
              filtro === "todas" && styles.filtroTextAtivo,
            ]}
          >
            Todas ({transacoes.length})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filtroChip,
            filtro === "receita" && styles.filtroChipAtivoReceita,
          ]}
          onPress={() => setFiltro("receita")}
        >
          <Ionicons
            name="arrow-up-circle"
            size={16}
            color={filtro === "receita" ? "#4ade80" : "#8b8b9b"}
          />
          <Text
            style={[
              styles.filtroText,
              filtro === "receita" && styles.filtroTextAtivoReceita,
            ]}
          >
            Receitas
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filtroChip,
            filtro === "despesa" && styles.filtroChipAtivoDespesa,
          ]}
          onPress={() => setFiltro("despesa")}
        >
          <Ionicons
            name="arrow-down-circle"
            size={16}
            color={filtro === "despesa" ? "#f87171" : "#8b8b9b"}
          />
          <Text
            style={[
              styles.filtroText,
              filtro === "despesa" && styles.filtroTextAtivoDespesa,
            ]}
          >
            Despesas
          </Text>
        </Pressable>
      </View>

      {/* CONTEÚDO PRINCIPAL: LOADING, ERRO OU LISTA */}
      {carregando && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6c5ce7" />
          <Text style={styles.loadingText}>Carregando transações...</Text>
        </View>
      ) : erro && transacoes.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={54} color="#f87171" />
          <Text style={styles.erroText}>{erro}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => carregar()}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={transacoesFiltradas}
          keyExtractor={(item, index) =>
            item.id ? String(item.id) : `transacao-${index}`
          }
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => carregar(true)}
              tintColor="#6c5ce7"
              colors={["#6c5ce7"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="receipt-outline" size={42} color="#8b8b9b" />
              </View>
              <Text style={styles.emptyTitle}>Nenhuma transação</Text>
              <Text style={styles.emptySubtitle}>
                {filtro === "todas"
                  ? "Você ainda não possui transações cadastradas."
                  : `Nenhuma transação do tipo "${filtro}" encontrada.`}
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.criarPrimeiraButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => router.push("/nova-transacao")}
              >
                <Text style={styles.criarPrimeiraButtonText}>
                  + Adicionar Transação
                </Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => {
            const isReceita = item.tipo === "receita";
            const isExcluindo = excluindoId === item.id;

            return (
              <View style={styles.card}>
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.iconCircle,
                      isReceita
                        ? styles.iconCircleReceita
                        : styles.iconCircleDespesa,
                    ]}
                  >
                    <Ionicons
                      name={isReceita ? "arrow-up" : "arrow-down"}
                      size={18}
                      color={isReceita ? "#4ade80" : "#f87171"}
                    />
                  </View>

                  <View style={styles.infoCol}>
                    <Text style={styles.cardDescricao} numberOfLines={1}>
                      {item.descricao}
                    </Text>

                    <View style={styles.metaRow}>
                      {item.data ? (
                        <Text style={styles.cardData}>
                          {formatarData(item.data)}
                        </Text>
                      ) : null}

                      {item.categoria ? (
                        <>
                          <Text style={styles.dot}>•</Text>
                          <Text style={styles.cardCategoria} numberOfLines={1}>
                            {item.categoria}
                          </Text>
                        </>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <Text
                    style={[
                      styles.cardValor,
                      isReceita ? styles.valorReceita : styles.valorDespesa,
                    ]}
                  >
                    {isReceita ? "+ " : "- "}
                    {formatarMoeda(item.valor)}
                  </Text>

                  <Pressable
                    style={({ pressed }) => [
                      styles.deleteButton,
                      pressed && styles.buttonPressed,
                    ]}
                    hitSlop={8}
                    disabled={isExcluindo}
                    onPress={() => handleConfirmarExclusao(item)}
                  >
                    {isExcluindo ? (
                      <ActivityIndicator size="small" color="#f87171" />
                    ) : (
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#8b8b9b"
                      />
                    )}
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080b18",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1a1e32",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#292f4d",
  },

  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },

  novoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#6c5ce7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  novoButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  buttonPressed: {
    opacity: 0.7,
  },

  filtrosContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },

  filtroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#111528",
    borderWidth: 1,
    borderColor: "#232945",
  },

  filtroChipAtivo: {
    backgroundColor: "#6c5ce7",
    borderColor: "#6c5ce7",
  },

  filtroChipAtivoReceita: {
    backgroundColor: "#133827",
    borderColor: "#4ade80",
  },

  filtroChipAtivoDespesa: {
    backgroundColor: "#3b1d24",
    borderColor: "#f87171",
  },

  filtroText: {
    color: "#9ea3b7",
    fontSize: 13,
    fontWeight: "600",
  },

  filtroTextAtivo: {
    color: "#ffffff",
  },

  filtroTextAtivoReceita: {
    color: "#4ade80",
  },

  filtroTextAtivoDespesa: {
    color: "#f87171",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    flexGrow: 1,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111528",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#232945",
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  iconCircleReceita: {
    backgroundColor: "#133827",
  },

  iconCircleDespesa: {
    backgroundColor: "#3b1d24",
  },

  infoCol: {
    flex: 1,
  },

  cardDescricao: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardData: {
    color: "#8b8b9b",
    fontSize: 12,
  },

  dot: {
    color: "#8b8b9b",
    fontSize: 12,
    marginHorizontal: 6,
  },

  cardCategoria: {
    color: "#8b7cff",
    fontSize: 12,
    fontWeight: "600",
  },

  cardRight: {
    alignItems: "flex-end",
    gap: 6,
  },

  cardValor: {
    fontSize: 15,
    fontWeight: "700",
  },

  valorReceita: {
    color: "#4ade80",
  },

  valorDespesa: {
    color: "#f87171",
  },

  deleteButton: {
    padding: 4,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  loadingText: {
    color: "#9ea3b7",
    fontSize: 14,
    marginTop: 12,
  },

  erroText: {
    color: "#f87171",
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 16,
  },

  retryButton: {
    backgroundColor: "#1a1e32",
    borderWidth: 1,
    borderColor: "#292f4d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },

  retryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },

  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#111528",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#232945",
    marginBottom: 16,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  emptySubtitle: {
    color: "#9ea3b7",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
    marginBottom: 20,
  },

  criarPrimeiraButton: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },

  criarPrimeiraButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
