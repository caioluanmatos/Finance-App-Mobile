import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  criarMeta,
  excluirMeta,
  listarMetas,
  Meta,
} from "@/services/metas";
import { formatarMoeda } from "@/utils/formatters";

export default function MetasScreen() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nome, setNome] = useState("");
  const [valorMeta, setValorMeta] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregarMetas = async () => {
    setCarregando(true);

    const resposta = await listarMetas();

    if (resposta.ok && resposta.data) {
      setMetas(resposta.data);
    } else {
      Alert.alert(
        "Erro",
        resposta.mensagem || "Não foi possível carregar suas metas."
      );
    }

    setCarregando(false);
  };

  useFocusEffect(
    useCallback(() => {
      carregarMetas();
    }, [])
  );

  const handleCriarMeta = async () => {
    if (!nome.trim() || !valorMeta.trim()) {
      Alert.alert(
        "Atenção",
        "Informe o nome e o valor da meta."
      );
      return;
    }

    const meta = Number(
      valorMeta.replace(",", ".")
    );

    const atual = valorAtual
      ? Number(valorAtual.replace(",", "."))
      : 0;

    if (Number.isNaN(meta) || meta <= 0) {
      Alert.alert(
        "Atenção",
        "Informe um valor de meta válido."
      );
      return;
    }

    if (Number.isNaN(atual) || atual < 0) {
      Alert.alert(
        "Atenção",
        "Informe um valor atual válido."
      );
      return;
    }

    setSalvando(true);

    const resposta = await criarMeta({
      nome: nome.trim(),
      valor_meta: meta,
      valor_atual: atual,
    });

    setSalvando(false);

    if (!resposta.ok) {
      Alert.alert(
        "Erro",
        resposta.mensagem || "Não foi possível criar a meta."
      );
      return;
    }

    setNome("");
    setValorMeta("");
    setValorAtual("");
    setMostrarFormulario(false);

    await carregarMetas();

    Alert.alert("Sucesso", "Meta criada com sucesso!");
  };

  const handleExcluirMeta = (meta: Meta) => {
    Alert.alert(
      "Excluir meta",
      `Deseja excluir "${meta.nome}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const resposta = await excluirMeta(meta.id);

            if (!resposta.ok) {
              Alert.alert(
                "Erro",
                resposta.mensagem ||
                  "Não foi possível excluir a meta."
              );
              return;
            }

            await carregarMetas();
          },
        },
      ]
    );
  };

  const calcularProgresso = (meta: Meta) => {
    const objetivo = Number(meta.valor_meta);
    const atual = Number(meta.valor_atual);

    if (objetivo <= 0) {
      return 0;
    }

    return Math.min(atual / objetivo, 1);
  };

  const renderMeta = ({ item }: { item: Meta }) => {
    const progresso = calcularProgresso(item);
    const porcentagem = Math.round(progresso * 100);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.metaIcon}>
            <Ionicons
              name="flag-outline"
              size={22}
              color="#ffffff"
            />
          </View>

          <View style={styles.cardTitleContainer}>
            <Text style={styles.metaNome}>
              {item.nome}
            </Text>

            <Text style={styles.porcentagem}>
              {porcentagem}% concluído
            </Text>
          </View>

          <Pressable
            style={styles.deleteButton}
            onPress={() => handleExcluirMeta(item)}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#ff6b6b"
            />
          </Pressable>
        </View>

        <View style={styles.valores}>
          <Text style={styles.valorAtual}>
            {formatarMoeda(Number(item.valor_atual))}
          </Text>

          <Text style={styles.valorObjetivo}>
            de {formatarMoeda(Number(item.valor_meta))}
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${porcentagem}%`,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Metas</Text>
          <Text style={styles.subtitle}>
            Acompanhe seus objetivos financeiros
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() =>
            setMostrarFormulario(!mostrarFormulario)
          }
        >
          <Ionicons
            name={mostrarFormulario ? "close" : "add"}
            size={26}
            color="#ffffff"
          />
        </Pressable>
      </View>

      {mostrarFormulario && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            Nova meta
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Comprar um carro"
            placeholderTextColor="#777c91"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Valor da meta"
            placeholderTextColor="#777c91"
            keyboardType="decimal-pad"
            value={valorMeta}
            onChangeText={setValorMeta}
          />

          <TextInput
            style={styles.input}
            placeholder="Quanto você já possui? (opcional)"
            placeholderTextColor="#777c91"
            keyboardType="decimal-pad"
            value={valorAtual}
            onChangeText={setValorAtual}
          />

          <Pressable
            style={[
              styles.salvarButton,
              salvando && styles.disabledButton,
            ]}
            onPress={handleCriarMeta}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.salvarText}>
                Criar meta
              </Text>
            )}
          </Pressable>
        </View>
      )}

      {carregando ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#8b7cff"
          />

          <Text style={styles.loadingText}>
            Carregando metas...
          </Text>
        </View>
      ) : (
        <FlatList
          data={metas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMeta}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          refreshing={carregando}
          onRefresh={carregarMetas}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="flag-outline"
                size={48}
                color="#62677c"
              />

              <Text style={styles.emptyTitle}>
                Nenhuma meta ainda
              </Text>

              <Text style={styles.emptyText}>
                Toque no + para criar sua primeira meta financeira.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080b18",
    paddingHorizontal: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    color: "#9ea3b7",
    fontSize: 14,
    marginTop: 4,
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#8b7cff",
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    backgroundColor: "#111528",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    gap: 12,
  },

  formTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  input: {
    height: 52,
    backgroundColor: "#080b18",
    borderWidth: 1,
    borderColor: "#232945",
    borderRadius: 14,
    paddingHorizontal: 16,
    color: "#ffffff",
    fontSize: 15,
  },

  salvarButton: {
    height: 52,
    backgroundColor: "#8b7cff",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  salvarText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.6,
  },

  lista: {
    paddingBottom: 30,
    flexGrow: 1,
  },

  card: {
    backgroundColor: "#111528",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#8b7cff",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },

  metaNome: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },

  porcentagem: {
    color: "#9ea3b7",
    fontSize: 13,
    marginTop: 3,
  },

  deleteButton: {
    padding: 8,
  },

  valores: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 18,
  },

  valorAtual: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  valorObjetivo: {
    color: "#8b8b9b",
    fontSize: 13,
    marginLeft: 6,
  },

  progressBackground: {
    height: 8,
    backgroundColor: "#232945",
    borderRadius: 4,
    marginTop: 12,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#8b7cff",
    borderRadius: 4,
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#9ea3b7",
    marginTop: 12,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
    marginTop: 14,
  },

  emptyText: {
    color: "#8b8b9b",
    fontSize: 14,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 20,
  },
});