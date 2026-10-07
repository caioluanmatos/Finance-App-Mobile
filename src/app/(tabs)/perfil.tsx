import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { removerToken } from "@/services/api";
import {
  alterarSenha,
  buscarPerfil,
  Perfil,
} from "@/services/perfil";

export default function PerfilScreen() {
  // =========================
  // ESTADOS DO PERFIL
  // =========================

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);

  // =========================
  // ESTADOS DA SENHA
  // =========================

  const [mostrarAlterarSenha, setMostrarAlterarSenha] =
    useState(false);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  // =========================
  // CARREGAR PERFIL
  // =========================

  const carregarPerfil = async () => {
    setCarregando(true);

    const resposta = await buscarPerfil();

    if (resposta.ok && resposta.data) {
      setPerfil(resposta.data);
    } else {
      Alert.alert(
        "Erro",
        resposta.mensagem ||
          "Não foi possível carregar seu perfil."
      );

      if (
        resposta.status === 401 ||
        resposta.status === 403
      ) {
        await removerToken();
        router.replace("/");
      }
    }

    setCarregando(false);
  };

  // =========================
  // ALTERAR SENHA
  // =========================

  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos."
      );

      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert(
        "Atenção",
        "A nova senha precisa ter pelo menos 6 caracteres."
      );

      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert(
        "Atenção",
        "A nova senha e a confirmação não são iguais."
      );

      return;
    }

    setAlterandoSenha(true);

    const resposta = await alterarSenha({
      senhaAtual,
      novaSenha,
      confirmarSenha,
    });

    setAlterandoSenha(false);

    if (!resposta.ok) {
      Alert.alert(
        "Erro",
        resposta.mensagem ||
          "Não foi possível alterar a senha."
      );

      return;
    }

    Alert.alert(
      "Sucesso",
      "Senha alterada com sucesso!"
    );

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setMostrarAlterarSenha(false);
  };

  // =========================
  // ATUALIZA PERFIL
  // =========================

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [])
  );

  // =========================
  // LOGOUT
  // =========================

  const sair = () => {
    Alert.alert(
      "Sair da conta",
      "Deseja realmente sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",

          onPress: async () => {
            await removerToken();

            router.replace("/");
          },
        },
      ]
    );
  };

  // =========================
  // CARREGAMENTO
  // =========================

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#8b7cff"
          />

          <Text style={styles.loadingText}>
            Carregando perfil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // TELA
  // =========================

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Perfil
      </Text>

      <Text style={styles.subtitle}>
        Sua conta no Finance App
      </Text>

      {/* AVATAR */}

      <View style={styles.avatar}>
        <Ionicons
          name="person"
          size={42}
          color="#ffffff"
        />
      </View>

      <Text style={styles.nome}>
        {perfil?.nome || "Usuário"}
      </Text>

      {/* DADOS DO USUÁRIO */}

      <View style={styles.card}>
        <View style={styles.info}>
          <Ionicons
            name="person-outline"
            size={22}
            color="#8b7cff"
          />

          <View>
            <Text style={styles.label}>
              Nome
            </Text>

            <Text style={styles.valor}>
              {perfil?.nome}
            </Text>
          </View>
        </View>

        <View style={styles.divisor} />

        <View style={styles.info}>
          <Ionicons
            name="mail-outline"
            size={22}
            color="#8b7cff"
          />

          <View>
            <Text style={styles.label}>
              E-mail
            </Text>

            <Text style={styles.valor}>
              {perfil?.email}
            </Text>
          </View>
        </View>
      </View>

      {/* BOTÃO ALTERAR SENHA */}

      <Pressable
        style={styles.senhaButton}
        onPress={() =>
          setMostrarAlterarSenha(
            !mostrarAlterarSenha
          )
        }
      >
        <Ionicons
          name="lock-closed-outline"
          size={21}
          color="#ffffff"
        />

        <Text style={styles.senhaText}>
          {mostrarAlterarSenha
            ? "Cancelar"
            : "Alterar senha"}
        </Text>
      </Pressable>

      {/* FORMULÁRIO DE SENHA */}

      {mostrarAlterarSenha && (
        <View style={styles.formSenha}>
          <TextInput
            style={styles.input}
            placeholder="Senha atual"
            placeholderTextColor="#777c91"
            secureTextEntry
            value={senhaAtual}
            onChangeText={setSenhaAtual}
          />

          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            placeholderTextColor="#777c91"
            secureTextEntry
            value={novaSenha}
            onChangeText={setNovaSenha}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar nova senha"
            placeholderTextColor="#777c91"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <Pressable
            style={[
              styles.salvarSenhaButton,
              alterandoSenha &&
                styles.botaoDesabilitado,
            ]}
            onPress={handleAlterarSenha}
            disabled={alterandoSenha}
          >
            {alterandoSenha ? (
              <ActivityIndicator
                color="#ffffff"
              />
            ) : (
              <Text
                style={styles.salvarSenhaText}
              >
                Salvar nova senha
              </Text>
            )}
          </Pressable>
        </View>
      )}

      {/* LOGOUT */}

      <Pressable
        style={styles.sairButton}
        onPress={sair}
      >
        <Ionicons
          name="log-out-outline"
          size={21}
          color="#ff6b6b"
        />

        <Text style={styles.sairText}>
          Sair da conta
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

// =========================
// ESTILOS
// =========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080b18",
    padding: 24,
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    color: "#9ea3b7",
    fontSize: 15,
    marginTop: 4,
    marginBottom: 28,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#8b7cff",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  nome: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 14,
    marginBottom: 28,
  },

  card: {
    backgroundColor: "#111528",
    borderRadius: 18,
    padding: 20,
  },

  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  label: {
    color: "#8b8b9b",
    fontSize: 13,
  },

  valor: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 3,
  },

  divisor: {
    height: 1,
    backgroundColor: "#232945",
    marginVertical: 18,
  },

  senhaButton: {
    height: 55,
    borderRadius: 14,
    backgroundColor: "#8b7cff",
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  senhaText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  formSenha: {
    marginTop: 16,
    gap: 12,
  },

  input: {
    height: 52,
    backgroundColor: "#111528",
    borderWidth: 1,
    borderColor: "#232945",
    borderRadius: 14,
    paddingHorizontal: 16,
    color: "#ffffff",
    fontSize: 15,
  },

  salvarSenhaButton: {
    height: 52,
    backgroundColor: "#8b7cff",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  salvarSenhaText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  sairButton: {
    height: 55,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ff6b6b",
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  sairText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "700",
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
});