import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { Link,router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

async function handleLogin() {
  if (!email.trim() || !senha) {
    Alert.alert("Atenção", "Informe e-mail e senha.");
    return;
  }

  try {
    const response = await fetch("http://10.0.2.2:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert(
        "Erro",
        data.mensagem || "Não foi possível fazer login."
      );
      return;
    }

    await SecureStore.setItemAsync("token", data.token);
    const tokenSalvo = await SecureStore.getItemAsync("token");


    router.replace("/dashboard");

    Alert.alert(
      "Sucesso",
      data.mensagem || "Login realizado com sucesso!"
    );

  } catch (error) {
    console.log("Erro no login:", error);

    Alert.alert(
      "Erro",
      "Não foi possível conectar ao servidor."
    );
  }
}


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>Finance App</Text>

            <Text style={styles.slogan}>Organize hoje. Conquiste amanhã.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Bem-vindo de volta</Text>

            <Text style={styles.subtitle}>
              Entre na sua conta para continuar
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#8b8b9b" />

                <TextInput
                  style={styles.input}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#8b8b9b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#8b8b9b"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#8b8b9b"
                  secureTextEntry={!mostrarSenha}
                  value={senha}
                  onChangeText={setSenha}
                />

                <Pressable onPress={() => setMostrarSenha(!mostrarSenha)}>
                  <Ionicons
                    name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                    size={21}
                    color="#8b8b9b"
                  />
                </Pressable>
              </View>
            </View>

            <Pressable>
              <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
            </Pressable>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Ainda não possui uma conta?
              </Text>
              <Link href="/register" asChild>
                <Pressable>
                  <Text style={styles.registerLink}> Criar conta</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
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

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffff",
  },

  slogan: {
    marginTop: 8,
    fontSize: 14,
    color: "#9ea3b7",
  },

  card: {
    backgroundColor: "#111528",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#232945",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#9ea3b7",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    color: "#d8daea",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  inputContainer: {
    height: 54,
    backgroundColor: "#0b0e1d",
    borderWidth: 1,
    borderColor: "#292f4d",
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
  },

  forgotPassword: {
    color: "#8b7cff",
    textAlign: "right",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 22,
  },

  loginButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#6c5ce7",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  registerContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  registerText: {
    color: "#9ea3b7",
    fontSize: 13,
  },

  registerLink: {
    color: "#8b7cff",
    fontWeight: "700",
    fontSize: 13,
  },
});
