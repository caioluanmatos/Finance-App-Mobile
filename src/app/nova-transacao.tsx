import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { criarTransacao } from "@/services/transacoes";
import { TipoTransacao } from "@/types/transacao";
import { obterDataAtualISO } from "@/utils/formatters";

export default function NovaTransacaoScreen() {
  const [tipo, setTipo] = useState<TipoTransacao>("despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(obterDataAtualISO());
  const [categoria, setCategoria] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (salvando) return;

    if (!descricao.trim()) {
      Alert.alert("Atenção", "Informe a descrição da transação.");
      return;
    }

    // Trata vírgula e ponto para converter para número
    const valorTratado = valor.replace(/\s/g, "").replace(",", ".");
    const valorNumerico = parseFloat(valorTratado);

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert("Atenção", "Informe um valor numérico válido maior que zero.");
      return;
    }

    const dataFinal = data.trim() || obterDataAtualISO();

    setSalvando(true);

    try {
      const resultado = await criarTransacao({
        descricao: descricao.trim(),
        valor: valorNumerico,
        tipo,
        data: dataFinal,
        categoria: categoria.trim() ? categoria.trim() : undefined,
      });

      if (resultado.sucesso) {
        Alert.alert("Sucesso", resultado.mensagem || "Transação cadastrada com sucesso!", [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        if (resultado.status === 401 || resultado.status === 403) {
          Alert.alert("Sessão Expirada", "Faça login novamente.", [
            { text: "OK", onPress: () => router.replace("/") },
          ]);
        } else {
          Alert.alert("Erro", resultado.mensagem || "Não foi possível cadastrar a transação.");
        }
      }
    } catch {
      Alert.alert("Erro", "Ocorreu um erro inesperado ao salvar a transação.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </Pressable>

          <Text style={styles.headerTitle}>Nova Transação</Text>

          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* SELETOR DE TIPO (RECEITA / DESPESA) */}
          <Text style={styles.sectionLabel}>Tipo de Transação</Text>
          <View style={styles.tipoContainer}>
            <Pressable
              style={[
                styles.tipoButton,
                tipo === "receita" && styles.tipoButtonReceitaAtivo,
              ]}
              onPress={() => setTipo("receita")}
            >
              <Ionicons
                name="arrow-up-circle"
                size={22}
                color={tipo === "receita" ? "#4ade80" : "#8b8b9b"}
              />
              <Text
                style={[
                  styles.tipoButtonText,
                  tipo === "receita" && styles.tipoButtonTextReceita,
                ]}
              >
                Receita
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.tipoButton,
                tipo === "despesa" && styles.tipoButtonDespesaAtivo,
              ]}
              onPress={() => setTipo("despesa")}
            >
              <Ionicons
                name="arrow-down-circle"
                size={22}
                color={tipo === "despesa" ? "#f87171" : "#8b8b9b"}
              />
              <Text
                style={[
                  styles.tipoButtonText,
                  tipo === "despesa" && styles.tipoButtonTextDespesa,
                ]}
              >
                Despesa
              </Text>
            </Pressable>
          </View>

          {/* CARD DE FORMULÁRIO */}
          <View style={styles.formCard}>
            {/* DESCRIÇÃO */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="document-text-outline" size={20} color="#8b8b9b" />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Salário, Mercado, Aluguel"
                  placeholderTextColor="#8b8b9b"
                  value={descricao}
                  onChangeText={setDescricao}
                  editable={!salvando}
                />
              </View>
            </View>

            {/* VALOR */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor (R$) *</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.prefixoMoeda}>R$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0,00"
                  placeholderTextColor="#8b8b9b"
                  keyboardType="decimal-pad"
                  value={valor}
                  onChangeText={setValor}
                  editable={!salvando}
                />
              </View>
            </View>

            {/* DATA */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={20} color="#8b8b9b" />
                <TextInput
                  style={styles.input}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor="#8b8b9b"
                  value={data}
                  onChangeText={setData}
                  editable={!salvando}
                />
              </View>
            </View>

            {/* CATEGORIA */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria (opcional)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="pricetag-outline" size={20} color="#8b8b9b" />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Alimentação, Moradia, Transporte"
                  placeholderTextColor="#8b8b9b"
                  value={categoria}
                  onChangeText={setCategoria}
                  editable={!salvando}
                />
              </View>
            </View>

            {/* BOTÃO SALVAR */}
            <Pressable
              style={({ pressed }) => [
                styles.salvarButton,
                pressed && styles.buttonPressed,
                salvando && styles.salvarButtonDisabled,
              ]}
              disabled={salvando}
              onPress={handleSalvar}
            >
              {salvando ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.salvarButtonText}>Salvando...</Text>
                </View>
              ) : (
                <Text style={styles.salvarButtonText}>Salvar Transação</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080b18",
  },

  keyboardView: {
    flex: 1,
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

  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  placeholder: {
    width: 44,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  sectionLabel: {
    color: "#d8daea",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 8,
  },

  tipoContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  tipoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#111528",
    borderWidth: 1,
    borderColor: "#232945",
  },

  tipoButtonReceitaAtivo: {
    backgroundColor: "#133827",
    borderColor: "#4ade80",
  },

  tipoButtonDespesaAtivo: {
    backgroundColor: "#3b1d24",
    borderColor: "#f87171",
  },

  tipoButtonText: {
    color: "#9ea3b7",
    fontSize: 15,
    fontWeight: "700",
  },

  tipoButtonTextReceita: {
    color: "#4ade80",
  },

  tipoButtonTextDespesa: {
    color: "#f87171",
  },

  formCard: {
    backgroundColor: "#111528",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#232945",
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    color: "#d8daea",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },

  inputContainer: {
    height: 52,
    backgroundColor: "#0b0e1d",
    borderWidth: 1,
    borderColor: "#292f4d",
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  prefixoMoeda: {
    color: "#8b8b9b",
    fontSize: 15,
    fontWeight: "700",
  },

  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
  },

  salvarButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#6c5ce7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  salvarButtonDisabled: {
    opacity: 0.6,
  },

  salvarButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
