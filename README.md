# 📱 Finance App Mobile

Aplicativo mobile de gerenciamento financeiro pessoal desenvolvido com **React Native**, **Expo** e **TypeScript**.

O **Finance App Mobile** é a versão mobile do projeto Finance App, criado com o objetivo de ajudar usuários a organizar suas finanças de forma simples, moderna e intuitiva.

> **Organize hoje. Conquiste amanhã.**

---

## 🚀 Sobre o projeto

O Finance App Mobile está sendo desenvolvido para permitir que usuários acompanhem e organizem sua vida financeira diretamente pelo celular.

O projeto também faz parte da evolução do Finance App para uma aplicação multiplataforma, utilizando uma arquitetura com frontend mobile e API backend.

Atualmente o aplicativo está em desenvolvimento.

---

## 🛠️ Tecnologias

O projeto utiliza:

- React Native
- Expo
- TypeScript
- Expo Router
- Node.js
- Express
- MySQL
- JWT

---

## 📂 Estrutura do projeto

```text
Finance-App-Mobile/
│
├── assets/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── explore.tsx
│   │   └── index.tsx
│   │
│   ├── components/
│   ├── constants/
│   └── hooks/
│
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📱 Funcionalidades planejadas

- 🔐 Login e autenticação
- 👤 Cadastro de usuários
- 📊 Dashboard financeiro
- 💰 Controle de receitas
- 💸 Controle de despesas
- 💳 Gerenciamento de transações
- 🎯 Metas financeiras
- 👤 Perfil do usuário
- 🔑 Recuperação de senha

---

## 🔐 Autenticação

A aplicação será integrada à API do Finance App para autenticação dos usuários.

A arquitetura utiliza **JWT (JSON Web Token)** para autenticação e proteção das rotas privadas.

---

## 🔗 Arquitetura

```text
Finance App Mobile
        │
        │ HTTP / API
        ▼
Node.js + Express
        │
        ▼
      MySQL
```

O aplicativo mobile será responsável pela interface e experiência do usuário, enquanto o backend será responsável pelas regras de negócio, autenticação e comunicação com o banco de dados.

---

## ▶️ Executando o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/caioluanmatos/Finance-App-Mobile.git
```

### 2. Entre na pasta

```bash
cd Finance-App-Mobile
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o Expo

```bash
npx expo start
```

Para executar utilizando um emulador Android:

```text
Pressione "a" no terminal do Expo
```

---

## 📌 Status

🚧 **Em desenvolvimento**

Primeira etapa:

- [x] Configuração do React Native
- [x] Configuração do Expo
- [x] Configuração do TypeScript
- [x] Configuração do Android Emulator
- [x] Estrutura inicial do projeto
- [x] Primeira interface de Login
- [ ] Finalizar interface de Login
- [ ] Criar tela de Cadastro
- [ ] Configurar navegação
- [ ] Integrar autenticação com a API
- [ ] Criar Dashboard
- [ ] Criar gerenciamento de transações
- [ ] Criar receitas e despesas
- [ ] Criar metas financeiras
- [ ] Criar perfil do usuário

---

## 💻 Versão Web

O Finance App também possui uma versão Web desenvolvida com React.

O objetivo é manter as versões **Web e Mobile conectadas à mesma API**, permitindo que os dados financeiros do usuário sejam acessados em diferentes plataformas.

---

## 👨‍💻 Autor

Desenvolvido por **Caio Luan Matos**

GitHub: **@caioluanmatos**

---

## 📄 Licença

Este projeto está sob a licença MIT.