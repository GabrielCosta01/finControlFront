# FinanceControl

**FinanceControl** é um sistema de controle financeiro para gerenciar categorias, contas a pagar e a receber, bancos, cofres, e transações financeiras. O projeto oferece uma interface responsiva e interativa, com integração de autenticação, dashboards de visão geral e relatórios detalhados.

## Tecnologias Utilizadas

- **Next.js 13**: Framework React para renderização no lado do servidor (SSR), API routes e geração de páginas dinâmicas.
- **React**: Biblioteca para construção de interfaces de usuário.
- **Redux**: Gerenciamento de estado global para controle de usuários e dados financeiros.
- **React Hook Form**: Para formular validado com integração de Yup.
- **Yup**: Biblioteca para validação de formulários.
- **React Toastify**: Exibição de notificações toast para feedback do usuário.
- **Lucide Icons**: Ícones vetoriais utilizados para a interface.
- **TailwindCSS**: Framework utilitário para design rápido e responsivo.

## Estrutura do Projeto

```plaintext
/finance-control
├── /app
│   ├── /dashboard            # Dashboard do usuário
│   ├── /users                # Gestão de usuários
│   ├── /categories           # Categorias financeiras
│   ├── /banks                # Gestão de bancos
│   ├── /payables             # Contas a pagar
│   ├── /receivables          # Contas a receber
│   ├── /reports              # Relatórios financeiros
│   └── layout.tsx            # Layout compartilhado de toda a aplicação
├── /components
│   ├── /ui                   # Componentes de UI (botões, inputs, etc)
├── /store                    # Redux Store e Slices
├── /styles                   # Arquivos de estilo
└── /pages                    # Páginas estáticas ou outras lógicas

```
## Como Rodar o projeto

#1. Clonar o repositório
```plainttext
git clone https://github.com/seu-usuario/finance-control.git
cd finance-control
```

#2. Instalar dependências
Instale as dependências utilizando npm ou yarn:
```plainttext
npm install
```
Ou, se você usa yarn:
```plainttext
yarn install
```
#3. Rodar o Projeto Localmente
Execute o projeto em modo de desenvolvimento:
```plainttext
npm run dev
```
Ou, se usa yarn:
```plainttext
yarn dev
```
Isso abrirá o projeto no seu navegador em http://localhost:3000.

