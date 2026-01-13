# Projeto E-commerce Full Stack 🚀

Este é um projeto completo de e-commerce moderno, desenvolvido com as tecnologias mais recentes do ecossistema JavaScript/TypeScript. O projeto é dividido em um backend robusto com NestJS e um frontend performático com Next.js, seguindo princípios de **Clean Architecture**, **SOLID** e padrões de design modernos.

## 🛠️ Tecnologias

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) & [Material UI (MUI)](https://mui.com/)
- **Gerenciamento de Estado:** [Redux Toolkit](https://redux-toolkit.js.org/) & [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Consumo de API:** [Axios](https://axios-http.com/) & [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Formulários:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/) & [Swiper](https://swiperjs.com/)
- **Pagamentos:** [Stripe](https://stripe.com/)
- **Tempo Real:** [Socket.io Client](https://socket.io/)

### Backend
- **Framework:** [NestJS](https://nestjs.com/)
- **Banco de Dados:** [TypeORM](https://typeorm.io/) (PostgreSQL/SQLite) & [Mongoose](https://mongoosejs.com/) (MongoDB)
- **Autenticação:** [Passport.js](https://www.passportjs.org/) & [JWT](https://jwt.io/) (Com Roles: Admin/User)
- **API:** REST (Documentada com Swagger)
- **Inteligência Artificial:** [LangChain](https://js.langchain.com/) (Integração com OpenAI e Ollama para suporte inteligente)
- **Comunicação:** [Socket.io](https://socket.io/)
- **Cache:** [Redis](https://redis.io/)
- **Relatórios:** [PDFKit](https://pdfkit.org/) & [BWIP-JS](https://github.com/metafloor/bwip-js) (Geração de Boletos e Códigos de Barras)

---

## ✨ Funcionalidades Principais

### 👤 Área do Usuário
- **Autenticação Completa:** Login, registro, recuperação de senha e edição de perfil.
- **Catálogo de Produtos:** Listagem dinâmica, categorias com filtros inteligentes e busca em tempo real.
- **Carrinho e Wishlist:** Gerenciamento de itens com persistência local e sincronização automática.
- **Gestão de Pedidos:** Histórico completo de compras e detalhes de cada pedido.
- **Acompanhamento de Entregas:** Página dedicada para rastreamento de pedidos com histórico de movimentações.
- **Checkout Integrado:** Pagamentos seguros via Stripe (Cartão), Pix e Boletos.

### 🛡️ Painel Administrativo (Admin)
- **Dashboard:** Visão geral das vendas e métricas do negócio.
- **Gestão de Entregas:** Painel exclusivo para atualizar status de envio, adicionar códigos de rastreio e movimentações logísticas.
- **Histórico de Entregas:** Consulta de todas as entregas finalizadas ou canceladas.
- **Gestão de Catálogo:** Controle total de produtos, categorias e estoque.
- **Análise Financeira:** Gráficos detalhados de faturamento e desempenho.
- **Logs de Atividade:** Rastreabilidade de ações administrativas no sistema.

---

## 📂 Estrutura do Projeto

```text
.
├── backend/          # API NestJS (Lógica de Negócio, Banco de Dados, IA)
├── frontend/         # App Next.js (Interface, Hooks, Redux)
└── README.md         # Documentação Principal
```

---

## 🚀 Como Iniciar

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v20 ou superior)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (opcional, para Redis/Postgres)

### Configuração do Backend
1. Entre na pasta: `cd backend`
2. Instale as dependências: `npm install`
3. Configure o `.env` (API Keys: Stripe, OpenAI, MongoDB, Redis)
4. Popule o banco (Seed): `npm run start:prod` (executa seed e inicia) ou `npx ts-node seed.ts`
5. Inicie em desenvolvimento: `npm run start:dev`

### Configuração do Frontend
1. Entre na pasta: `cd frontend`
2. Instale as dependências: `npm install`
3. Inicie a aplicação: `npm run dev`
4. Acesse: `http://localhost:3000`

---

## 🛠️ Scripts Administrativos

- `npx ts-node create-admin.ts`: Cria rapidamente um usuário com privilégios de administrador.
- `./generate_resources.ps1`: Script PowerShell para gerar novos módulos seguindo o padrão do projeto.

---

## 📝 Notas de Desenvolvimento

Este projeto foi construído focando em **escalabilidade** e **manutenibilidade**. 
- O frontend utiliza **React Query** para cache de dados e **Redux** para estados globais.
- O backend é modularizado, facilitando a expansão de novas funcionalidades.
- O sistema de entregas foi integrado para fornecer uma experiência transparente ao cliente final.
