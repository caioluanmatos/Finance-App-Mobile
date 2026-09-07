import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

 async function handleRegister() {
  if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
    Alert.alert("Atenção", "Preencha todos os campos.");
    return;
  }

  const emailValido = /\S+@\S+\.\S+/.test(email);

  if (!emailValido) {
    Alert.alert("Atenção", "Digite um e-mail válido.");
    return;
  }

  if (senha !== confirmarSenha) {
    Alert.alert("Atenção", "As senhas não coincidem.");
    return;
  }

  if (senha.length < 6) {
    Alert.alert(
      "Atenção",
      "A senha precisa ter pelo menos 6 caracteres."
    );
    return;
  }

  try {
    const response = await fetch("http://10.0.2.2:3000/cadastro", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        nome,
        email,
        senha,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Erro", data.mensagem || "Erro ao criar conta.");
      return;
    }

    Alert.alert(
      "Sucesso",
      data.mensagem || "Conta criada com sucesso!"
    );
  } catch (error) {
    console.log("Erro no cadastro:", error);
    Alert.alert("Erro", "Não foi possível conectar ao servidor.");
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.logo}>Finance App</Text>

          <Text style={styles.title}>Criar conta</Text>

          <Text style={styles.subtitle}>
            Comece a organizar sua vida financeira
          </Text>

          {/* NOME */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#8b8b9b" />

            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#8b8b9b"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* E-MAIL */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#8b8b9b" />

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#8b8b9b"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* SENHA */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#8b8b9b" />

            <TextInput
              style={styles.input}
              placeholder="Senha"
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

          {/* CONFIRMAR SENHA */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#8b8b9b" />

            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#8b8b9b"
              secureTextEntry={!mostrarSenha}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
          </View>

          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Criar conta</Text>
          </Pressable>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já possui uma conta?</Text>

            <Pressable onPress={() => router.back()}>
              <Text style={styles.loginLink}> Entrar</Text>
            </Pressable>
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

  logo: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 28,
  },

  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    color: "#9ea3b7",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },

  inputContainer: {
    height: 54,
    backgroundColor: "#111528",
    borderWidth: 1,
    borderColor: "#292f4d",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
  },

  button: {
    height: 54,
    backgroundColor: "#6c5ce7",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  loginText: {
    color: "#9ea3b7",
    fontSize: 13,
  },

  loginLink: {
    color: "#8b7cff",
    fontSize: 13,
    fontWeight: "700",
  },
});
