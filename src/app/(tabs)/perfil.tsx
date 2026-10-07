import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
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
  // PERFIL
  // =========================

  const [perfil, setPerfil] =
    useState<Perfil | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  // =========================
  // SENHA
  // =========================

  const [
    mostrarAlterarSenha,
    setMostrarAlterarSenha,
  ] = useState(false);

  const [senhaAtual, setSenhaAtual] =
    useState("");

  const [novaSenha, setNovaSenha] =
    useState("");

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState("");

  const [
    alterandoSenha,
    setAlterandoSenha,
  ] = useState(false);

  // =========================
  // PERFIL
  // =========================

  const carregarPerfil = async () => {
    setCarregando(true);

    const resposta =
      await buscarPerfil();

    if (
      resposta.ok &&
      resposta.data
    ) {
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

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [])
  );

  // =========================
  // ALTERAR SENHA
  // =========================

  const handleAlterarSenha =
    async () => {
      if (
        !senhaAtual ||
        !novaSenha ||
        !confirmarSenha
      ) {
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

      if (
        novaSenha !==
        confirmarSenha
      ) {
        Alert.alert(
          "Atenção",
          "A nova senha e a confirmação não são iguais."
        );

        return;
      }

      setAlterandoSenha(true);

      const resposta =
        await alterarSenha({
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
      setMostrarAlterarSenha(
        false
      );
    };

  // =========================
  // ASSINATURA
  // =========================

  const handleAssinatura = () => {
    Alert.alert(
      "Planos",
      "Os planos de assinatura serão disponibilizados em breve."
    );
  };

  // =========================
  // OPEN FINANCE
  // =========================

  const handleOpenFinance = () => {
    Alert.alert(
      "Open Finance",
      "A conexão com instituições financeiras será disponibilizada em uma próxima versão."
    );
  };

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
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={styles.loading}
        >
          <ActivityIndicator
            size="large"
            color="#8b7cff"
          />

          <Text
            style={
              styles.loadingText
            }
          >
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
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* HEADER */}

        <Text style={styles.title}>
          Perfil
        </Text>

        <Text
          style={styles.subtitle}
        >
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
          {perfil?.nome ||
            "Usuário"}
        </Text>

        {/* =====================
            DADOS DA CONTA
        ====================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Dados da conta
        </Text>

        <View style={styles.card}>
          <View style={styles.info}>
            <View
              style={
                styles.iconContainer
              }
            >
              <Ionicons
                name="person-outline"
                size={21}
                color="#8b7cff"
              />
            </View>

            <View
              style={
                styles.infoText
              }
            >
              <Text
                style={styles.label}
              >
                Nome
              </Text>

              <Text
                style={styles.valor}
              >
                {perfil?.nome}
              </Text>
            </View>
          </View>

          <View
            style={styles.divisor}
          />

          <View style={styles.info}>
            <View
              style={
                styles.iconContainer
              }
            >
              <Ionicons
                name="mail-outline"
                size={21}
                color="#8b7cff"
              />
            </View>

            <View
              style={
                styles.infoText
              }
            >
              <Text
                style={styles.label}
              >
                E-mail
              </Text>

              <Text
                style={styles.valor}
                numberOfLines={1}
              >
                {perfil?.email}
              </Text>
            </View>
          </View>
        </View>

        {/* =====================
            ASSINATURA
        ====================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Assinatura
        </Text>

        <View
          style={
            styles.subscriptionCard
          }
        >
          <View
            style={
              styles.subscriptionTop
            }
          >
            <View
              style={
                styles.subscriptionIcon
              }
            >
              <Ionicons
                name="diamond-outline"
                size={24}
                color="#8b7cff"
              />
            </View>

            <View
              style={
                styles.subscriptionInfo
              }
            >
              <Text
                style={
                  styles.cardLabel
                }
              >
                Plano atual
              </Text>

              <Text
                style={
                  styles.planName
                }
              >
                Gratuito
              </Text>
            </View>

            <View
              style={styles.badge}
            >
              <Text
                style={
                  styles.badgeText
                }
              >
                FREE
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.cardDescription
            }
          >
            Use os principais
            recursos para organizar
            suas finanças.
          </Text>

          <Pressable
            style={({
              pressed,
            }) => [
              styles.secondaryButton,

              pressed &&
                styles.buttonPressed,
            ]}
            onPress={
              handleAssinatura
            }
          >
            <Text
              style={
                styles.secondaryButtonText
              }
            >
              Conhecer planos
            </Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#8b7cff"
            />
          </Pressable>
        </View>

        {/* =====================
            OPEN FINANCE
        ====================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Open Finance
        </Text>

        <View
          style={
            styles.openFinanceCard
          }
        >
          <View
            style={
              styles.openFinanceHeader
            }
          >
            <View
              style={
                styles.bankIcon
              }
            >
              <Ionicons
                name="business-outline"
                size={24}
                color="#4ade80"
              />
            </View>

            <View
              style={
                styles.openFinanceInfo
              }
            >
              <Text
                style={
                  styles.openFinanceTitle
                }
              >
                Contas bancárias
              </Text>

              <View
                style={
                  styles.statusRow
                }
              >
                <View
                  style={
                    styles.statusDot
                  }
                />

                <Text
                  style={
                    styles.statusText
                  }
                >
                  Não conectado
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={
              styles.cardDescription
            }
          >
            Conecte suas contas
            bancárias para acompanhar
            suas finanças
            automaticamente.
          </Text>

          <Pressable
            style={({
              pressed,
            }) => [
              styles.openFinanceButton,

              pressed &&
                styles.buttonPressed,
            ]}
            onPress={
              handleOpenFinance
            }
          >
            <Ionicons
              name="link-outline"
              size={20}
              color="#ffffff"
            />

            <Text
              style={
                styles.openFinanceButtonText
              }
            >
              Conectar banco
            </Text>
          </Pressable>
        </View>

        {/* =====================
            SEGURANÇA
        ====================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Segurança
        </Text>

        <Pressable
          style={({
            pressed,
          }) => [
            styles.senhaButton,

            pressed &&
              styles.buttonPressed,
          ]}
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

          <Text
            style={
              styles.senhaText
            }
          >
            {mostrarAlterarSenha
              ? "Cancelar"
              : "Alterar senha"}
          </Text>

          <Ionicons
            name={
              mostrarAlterarSenha
                ? "chevron-up"
                : "chevron-down"
            }
            size={18}
            color="#ffffff"
          />
        </Pressable>

        {/* FORMULÁRIO SENHA */}

        {mostrarAlterarSenha && (
          <View
            style={
              styles.formSenha
            }
          >
            <TextInput
              style={styles.input}
              placeholder="Senha atual"
              placeholderTextColor="#777c91"
              secureTextEntry
              value={senhaAtual}
              onChangeText={
                setSenhaAtual
              }
              editable={
                !alterandoSenha
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Nova senha"
              placeholderTextColor="#777c91"
              secureTextEntry
              value={novaSenha}
              onChangeText={
                setNovaSenha
              }
              editable={
                !alterandoSenha
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar nova senha"
              placeholderTextColor="#777c91"
              secureTextEntry
              value={
                confirmarSenha
              }
              onChangeText={
                setConfirmarSenha
              }
              editable={
                !alterandoSenha
              }
            />

            <Pressable
              style={[
                styles.salvarSenhaButton,

                alterandoSenha &&
                  styles.botaoDesabilitado,
              ]}
              onPress={
                handleAlterarSenha
              }
              disabled={
                alterandoSenha
              }
            >
              {alterandoSenha ? (
                <ActivityIndicator
                  color="#ffffff"
                />
              ) : (
                <Text
                  style={
                    styles.salvarSenhaText
                  }
                >
                  Salvar nova senha
                </Text>
              )}
            </Pressable>
          </View>
        )}

        {/* =====================
            LOGOUT
        ====================== */}

        <Pressable
          style={({
            pressed,
          }) => [
            styles.sairButton,

            pressed &&
              styles.buttonPressed,
          ]}
          onPress={sair}
        >
          <Ionicons
            name="log-out-outline"
            size={21}
            color="#ff6b6b"
          />

          <Text
            style={
              styles.sairText
            }
          >
            Sair da conta
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// =========================
// ESTILOS
// =========================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#080b18",
    },

    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 50,
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
      backgroundColor:
        "#8b7cff",
      alignItems: "center",
      justifyContent:
        "center",
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

    sectionTitle: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 10,
      marginTop: 18,
    },

    card: {
      backgroundColor:
        "#111528",
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: "#232945",
    },

    info: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },

    infoText: {
      flex: 1,
    },

    iconContainer: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor:
        "#1a1e32",
      alignItems: "center",
      justifyContent:
        "center",
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
      backgroundColor:
        "#232945",
      marginVertical: 18,
    },

    // ASSINATURA

    subscriptionCard: {
      backgroundColor:
        "#111528",
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: "#302a5c",
    },

    subscriptionTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    subscriptionIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor:
        "#211d45",
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 12,
    },

    subscriptionInfo: {
      flex: 1,
    },

    cardLabel: {
      color: "#8b8b9b",
      fontSize: 12,
    },

    planName: {
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "700",
      marginTop: 2,
    },

    badge: {
      backgroundColor:
        "#292451",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
    },

    badgeText: {
      color: "#a99fff",
      fontSize: 11,
      fontWeight: "800",
    },

    cardDescription: {
      color: "#9ea3b7",
      fontSize: 13,
      lineHeight: 20,
      marginTop: 14,
      marginBottom: 16,
    },

    secondaryButton: {
      height: 46,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#393363",
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      paddingHorizontal: 16,
    },

    secondaryButtonText: {
      color: "#8b7cff",
      fontSize: 14,
      fontWeight: "700",
    },

    // OPEN FINANCE

    openFinanceCard: {
      backgroundColor:
        "#111528",
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: "#233d38",
    },

    openFinanceHeader: {
      flexDirection: "row",
      alignItems: "center",
    },

    bankIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor:
        "#133827",
      alignItems: "center",
      justifyContent:
        "center",
      marginRight: 12,
    },

    openFinanceInfo: {
      flex: 1,
    },

    openFinanceTitle: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "700",
    },

    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },

    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor:
        "#8b8b9b",
      marginRight: 7,
    },

    statusText: {
      color: "#8b8b9b",
      fontSize: 12,
    },

    openFinanceButton: {
      height: 48,
      borderRadius: 12,
      backgroundColor:
        "#16805b",
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      gap: 8,
    },

    openFinanceButtonText: {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "700",
    },

    // SEGURANÇA

    senhaButton: {
      height: 55,
      borderRadius: 14,
      backgroundColor:
        "#8b7cff",
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
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
      backgroundColor:
        "#111528",
      borderWidth: 1,
      borderColor: "#232945",
      borderRadius: 14,
      paddingHorizontal: 16,
      color: "#ffffff",
      fontSize: 15,
    },

    salvarSenhaButton: {
      height: 52,
      backgroundColor:
        "#8b7cff",
      borderRadius: 14,
      alignItems: "center",
      justifyContent:
        "center",
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
      marginTop: 28,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "center",
      gap: 10,
    },

    sairText: {
      color: "#ff6b6b",
      fontSize: 16,
      fontWeight: "700",
    },

    buttonPressed: {
      opacity: 0.75,
    },

    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent:
        "center",
    },

    loadingText: {
      color: "#9ea3b7",
      marginTop: 12,
    },
  });