# ✈️ AEROCODE Industrial Systems v2.0

> **Plataforma Avançada de Gestão para Produção e Manutenção Aeroespacial.**
> 
> **Hospedagem oficial:** [https://av-2-chaim.vercel.app](https://av-2-chaim.vercel.app)

O **Aerocode V2.0** é a evolução do sistema de gestão de aeronaves, migrando de uma interface de linha de comando (CLI) para uma **Single Page Application (SPA)** moderna e intuitiva. O projeto foca no controle rigoroso da linha de montagem, rastreabilidade de componentes e conformidade técnica para grandes corporações do setor aeroespacial.

---

## 🛠️ Tecnologias e Arquitetura

O sistema foi desenvolvido utilizando as tecnologias mais modernas do ecossistema Front-end para garantir performance e escalabilidade:

- **React 19:** Biblioteca principal para construção da interface baseada em componentes.
- **TypeScript:** Tipagem estática para maior segurança e robustez do código.
- **Vite:** Ferramenta de build ultra-rápida para o desenvolvimento moderno.
- **React Router 7:** Gerenciamento de rotas e navegação fluida sem recarregamento.
- **Lucide React:** Conjunto de ícones minimalistas e profissionais.
- **Local Storage API:** Persistência de dados local, permitindo o funcionamento completo como um protótipo navegável sem necessidade de back-end externo.

---

## 🚀 Funcionalidades Principais

### 1. Gestão de Frota (Aeronaves)
Cadastro completo de aeronaves com especificações técnicas (Modelo, Tipo, Capacidade e Alcance).

### 2. Inventário e Rastreabilidade (Peças)
Controle de componentes nacionais e importados, com vínculo direto às aeronaves para garantir a rastreabilidade total de cada item montado.

### 3. Linha de Produção (Kanban Funcional)
Monitoramento em tempo real do hangar:
- **Execução Simultânea:** Múltiplas etapas podem ocorrer ao mesmo tempo.
- **Entrega Sequencial (FIFO):** Uma trava lógica impede que uma etapa seja finalizada se as etapas anteriores ainda estiverem pendentes.

### 4. Controle de Qualidade
Registro de testes elétricos, hidráulicos e aerodinâmicos com histórico de aprovação.

### 5. Central de Relatórios e Preview
Gerador de documentos oficiais em formato `.txt`:
- **Laudo Final (Airworthiness):** Detalhamento da aeronave, peças e equipe envolvida.
- **Estoque Consolidado:** Status atual do inventário.
- **Histórico de Colaboradores:** Rastreio de todas as atividades realizadas por cada membro da equipe.
- **Visualização em Tempo Real:** Módulo para ler o relatório diretamente no navegador antes do download.

---

## 📖 Documentação Adicional

Além deste README, o projeto conta com um **Manual do Usuário** detalhado, contendo o mapa mental da arquitetura, fluxos de navegação e guia de processos.

- **Arquivo:** `Documentos/Manual_Usuario.pdf`

---

## 🔐 Níveis de Acesso e Logins

O sistema implementa uma hierarquia rigorosa de permissões. Para testar o protótipo, utilize as credenciais padrão abaixo:

| Papel | Usuário | Senha | Permissões |
| :--- | :--- | :--- | :--- |
| **Administrador** | `adm` | `adm` | Acesso total e gestão da equipe (RH). |
| **Engenheiro** | `eng` | `eng` | Gestão técnica, peças, qualidade e relatórios. |
| **Operador** | `op` | `op` | Acompanhamento da linha de produção (Hangar). |

---

## 📦 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/Spockchaim/AV2.git
   ```
2. Entre na pasta do front-end:
   ```bash
   cd AV2/aerocode-frontend/
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:5173` no seu navegador.

---

## 🌐 Deploy na Vercel

O projeto está configurado para deploy contínuo na Vercel. O arquivo `vercel.json` garante que as rotas do React sejam tratadas corretamente pelo servidor da Vercel.

**Configurações de Deploy:**
- **Framework Preset:** Vite
- **Root Directory:** `aerocode-frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## 👨‍💻 Desenvolvedor

- **Pedro Chaim** - [GitHub](https://github.com/Spockchaim)
- **Instituição:** FATEC
- **Disciplina:** Técnicas de Programação
- **Professor:** Gerson Penha
- **Data:** Maio de 2026

---
© 2026 Aerocode Sistemas Aeroespaciais | Documentação de Avaliação 2
