import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {

  useEffect(() => {
    verificarToken();
  }, []);

  async function verificarToken() {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      router.replace("/");
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
          <Text style={styles.title}>Dashboard</Text>

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
});