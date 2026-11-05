# 🪙 Conversor de Moedas • Mobile App

<p align="center">
  <img src="./assets/icon.png" width="100" alt="Logo do Conversor de Moedas" />
</p>

<p align="center">
  <strong>Aplicativo móvel de câmbio internacional e conversão de moedas em tempo real.</strong><br>
  Desenvolvido com <strong>React Native</strong>, <strong>Expo</strong> e <strong>React Navigation</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2058-blue?logo=expo" alt="Expo SDK 58" />
  <img src="https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/API-ExchangeRate--API-green" alt="ExchangeRate API" />
  <img src="https://img.shields.io/badge/License-MIT-purple" alt="License MIT" />
</p>

---

## 📖 Sobre o Projeto

O **Conversor de Moedas** é uma aplicação mobile desenvolvida para a disciplina de **Desenvolvimento Móvel**. O objetivo principal do projeto é oferecer aos usuários uma ferramenta ágil, intuitiva e moderna para monitorar cotações cambiais de mais de 160 moedas mundiais, salvar suas moedas favoritas e simular conversões precisas instantaneamente com dados ao vivo da **ExchangeRate-API**.

---

## ✨ Funcionalidades

### 🏠 1. Interface Principal (Início)
- 📌 Apresentação clara do objetivo do aplicativo e dos recursos disponíveis.
- 🚀 Cards de atalho para navegação rápida para as seções de cotações, favoritas, conversor e sobre.
- 🧭 Botão no cabeçalho para abertura ágil do menu lateral (**Drawer Navigation**).

### 📋 2. Aba Moedas (Todas as Cotações)
- 🌐 Listagem de mais de 160 moedas recuperadas diretamente da API oficial.
- 💵 Exibição de taxa de conversão em tempo real em relação à moeda base (`1 USD = X moeda`).
- 🔍 Barra de pesquisa em tempo real por sigla (`BRL`, `USD`, `EUR`) ou pelo nome da moeda.
- ⭐ Ação de favoritar e desfavoritar com um toque (ícone de estrela).
- 🔄 Recarregamento dinâmico via *pull-to-refresh* (arraste para baixo).
- 👆 Toque em qualquer moeda da lista para enviá-la automaticamente para o Conversor.

### ⭐ 3. Aba Favoritas
- 💾 Listagem dedicada com as moedas que o usuário marcou como favoritas.
- 🔒 **Persistência de Dados**: moedas favoritas salvas com `@react-native-async-storage/async-storage`, permanecendo salvas mesmo após fechar o app.
- ⚡ Botão de ação rápida para simular conversões imediatas com a moeda favorita.
- ❌ Remoção simplificada de moedas da lista de favoritos.
- 💡 Tela de estado vazio amigável com atalho para explorar novas moedas.

### 🔄 4. Aba Converter
- 💱 Seleção simplificada da **Moeda Origem** e **Moeda Destino**.
- 🗂️ **Modal Seletor com Busca**: permite escolher moedas com facilidade, trazendo as favoritas no topo.
- ⇄ **Botão Swap (Inverter)**: inverte origem e destino com um clique.
- 🔢 Campo numérico com suporte a decimais e botão para limpar valor rapidamente.
- ⚡ **Chips de Valores Rápidos**: botões pré-definidos de valores (10, 50, 100, 500, 1000).
- 📊 **Exibição do Resultado**:
  - ✅ **Valor de Origem** formatado.
  - 🟢 **Valor de Destino** em destaque com alta precisão.
  - 📈 **Taxa de Conversão** exata utilizada no cálculo.
  - 🕒 Horário e data oficial da cotação emitida pela API.

### ℹ️ 5. Interface Sobre
- 📱 Resumo completo sobre o aplicativo e seu propósito pedagógico.
- 🌐 Informações e créditos da **ExchangeRate-API** com links diretos para a documentação e site oficial.
- 🛠️ Relação das tecnologias e padrões de arquitetura aplicados.

---

## 🗺️ Arquitetura de Navegação

O aplicativo adota a estrutura de navegação híbrida recomendada pelo desafio:

```
NavigationContainer
 └── 📂 Drawer Navigator (Menu Lateral)
      ├── 🏠 Início (HomeScreen)
      ├── ℹ️ Sobre (AboutScreen)
      └── 🪙 Moedas (MoedasTabs)
           └── 📑 Bottom Tabs Navigator (Abas Inferiores)
                ├── 📋 Moedas (MoedasListScreen)
                ├── ⭐ Favoritas (FavoritasScreen)
                └── 🔄 Converter (ConverterScreen)
```

---

## 🛠️ Tecnologias e Bibliotecas

- **[React Native](https://reactnative.dev/)**: framework para desenvolvimento mobile multiplataforma.
- **[Expo SDK 58](https://expo.dev/)**: ecossistema moderno para desenvolvimento e build React Native.
- **[@react-navigation/drawer](https://reactnavigation.org/docs/drawer-based-navigation/)**: menu de navegação lateral (Drawer).
- **[@react-navigation/bottom-tabs](https://reactnavigation.org/docs/bottom-tab-navigator/)**: navegação inferior em abas para a seção de Moedas.
- **[@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)**: persistência de dados local segura no dispositivo.
- **[React Context API](https://react.dev/reference/react/createContext)**: gerenciamento global de estado das moedas favoritas.
- **[@expo/vector-icons](https://icons.expo.fyi/)**: iconografia profissional com Ionicons.
- **[ExchangeRate-API (v6)](https://www.exchangerate-api.com/)**: API REST externa para consumo de dados cambiais em tempo real.

---

## 🌐 Endpoints da API Utilizados

| Finalidade | Método | Endpoint |
|---|---|---|
| Cotações Recentes | `GET` | `https://v6.exchangerate-api.com/v6/{API_KEY}/latest/USD` |
| Moedas Suportadas | `GET` | `https://v6.exchangerate-api.com/v6/{API_KEY}/codes` |
| Conversão de Pares | `GET` | `https://v6.exchangerate-api.com/v6/{API_KEY}/pair/{FROM}/{TO}/{AMOUNT}` |

---

## 📂 Estrutura de Arquivos

```bash
ConversorMoedas/
├── assets/                    # Ícones e imagens do aplicativo
├── src/
│   ├── context/
│   │   └── FavoritesContext.js # Estado global e persistência de favoritas (AsyncStorage)
│   ├── screens/
│   │   ├── HomeScreen.js       # Tela Início com objetivo e atalhos rápidos
│   │   ├── AboutScreen.js      # Tela Sobre com detalhes e documentação
│   │   ├── MoedasListScreen.js # Aba com todas as moedas e cotações
│   │   ├── FavoritasScreen.js  # Aba com listagem de moedas favoritadas
│   │   └── ConverterScreen.js  # Aba com conversor e resultado detalhado
│   └── services/
│       └── api.js              # Serviço de integração com a ExchangeRate-API
├── App.js                     # Configuração do Drawer, Tabs e Context Provider
├── index.js                   # Ponto de entrada da aplicação
├── app.json                   # Configurações do Expo
├── package.json               # Dependências e scripts do projeto
└── README.md                  # Documentação do projeto
```

---

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos
- **Node.js** (versão 18 ou superior)
- Celular com o app **Expo Go** instalado ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) ou [iOS](https://apps.apple.com/app/expo-go/id982107779)) ou um emulador configurado.

### ⚙️ Passo a Passo

1. **Clone o repositório ou acesse a pasta do projeto**:
   ```bash
   cd ConversorMoedas
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npx expo start
   ```

4. **Abra o aplicativo**:
   - Escaneie o **QR Code** no terminal com a câmera do seu celular (iOS) ou com o app **Expo Go** (Android).
   - Para rodar no emulador Android, pressione `a` no terminal.
   - Para rodar no emulador iOS (Mac), pressione `i`.

---

## 👨‍💻 Desenvolvido Por

Projeto acadêmico desenvolvido para a disciplina de **Desenvolvimento Móvel**.

---

<p align="center">
  Feito com 💙 e React Native.
</p>

