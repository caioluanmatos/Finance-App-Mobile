import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    verificarToken();
    carregarTransacoes();
  }, []);

  async function verificarToken() {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      router.replace("/");
    }
  }

  async function carregarTransacoes() {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const response = await fetch(
        "http://10.0.2.2:3000/transacoes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("Erro ao buscar transações:", data);
        return;
      }

      const totalReceitas = data
        .filter((transacao: any) => transacao.tipo === "receita")
        .reduce(
          (total: number, transacao: any) =>
            total + Number(transacao.valor),
          0
        );

      const totalDespesas = data
        .filter((transacao: any) => transacao.tipo === "despesa")
        .reduce(
          (total: number, transacao: any) =>
            total + Number(transacao.valor),
          0
        );

      setReceitas(totalReceitas);
      setDespesas(totalDespesas);
      setSaldo(totalReceitas - totalDespesas);

    } catch (error) {
      console.log("Erro ao carregar transações:", error);
    }
  }

  async function handleLogout() {
    await SecureStore.deleteItemAsync("token");

    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Dashboard
          </Text>

          <Text style={styles.subtitle}>
            Bem-vindo ao Finance App 🚀
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color="#ffffff"
          />
        </Pressable>
      </View>

      <View style={styles.cardsContainer}>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            Saldo atual
          </Text>

          <Text style={styles.saldo}>
            R$ {saldo.toFixed(2)}
          </Text>
        </View>

        <View style={styles.cardRow}>

          <View style={styles.smallCard}>
            <Text style={styles.cardLabel}>
              Receitas
            </Text>

            <Text style={styles.receitas}>
              R$ {receitas.toFixed(2)}
            </Text>
          </View>

          <View style={styles.smallCard}>
            <Text style={styles.cardLabel}>
              Despesas
            </Text>

            <Text style={styles.despesas}>
              R$ {despesas.toFixed(2)}
            </Text>
          </View>

        </View>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080b18",
    padding: 24,
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
    fontSize: 16,
    marginTop: 8,
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
    marginTop: 32,
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

  cardLabel: {
    color: "#9ea3b7",
    fontSize: 14,
    marginBottom: 8,
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
});