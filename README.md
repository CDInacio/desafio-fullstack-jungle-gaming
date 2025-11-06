# 🎮 Desafio Fullstack - Jungle Gaming

> Sistema fullstack desenvolvido como desafio técnico, utilizando arquitetura de monorepo com Turborepo, NestJS no backend e React no frontend.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Decisões Técnicas e Trade-offs](#decisões-técnicas-e-trade-offs)
- [Problemas Conhecidos e Melhorias Futuras](#problemas-conhecidos-e-melhorias-futuras)
- [Tempo de Desenvolvimento](#tempo-de-desenvolvimento)

## 🎯 Sobre o Projeto

[Descreva aqui o objetivo principal do projeto, o problema que ele resolve e suas principais funcionalidades]

**Exemplo:**
Este projeto foi desenvolvido como parte de um desafio técnico para a Jungle Gaming. O sistema permite [descreva as funcionalidades principais: gerenciamento de usuários, cadastro de produtos, etc.].

## 🚀 Tecnologias Utilizadas

### Backend

- **React** - Framework Node.js para construção de aplicações server-side
- **TypeScript** - Superset JavaScript com tipagem estática
- **[Adicione outras: PostgreSQL, Redis, etc.]**

## 🚀 Tecnologias Utilizadas

### Backend

- **Node.js** – Ambiente de execução JavaScript no servidor
- **TypeScript** – Superset do JavaScript com tipagem estática
- **TypeORM** – ORM para modelagem e comunicação com o banco de dados
- **PostgreSQL** – Banco de dados relacional principal
- **Redis** – Armazenamento em cache e gerenciamento de filas
- **JWT (JSON Web Token)** – Autenticação e controle de sessões seguras
- **RabbitMQ** – Mensageria e comunicação assíncrona entre microsserviços
- **Swagger** – Documentação interativa e automática da API
- **WebSockets** – Comunicação em tempo real entre cliente e servidor

### Frontend

- **Vite** – Ferramenta moderna e performática de build
- **React** – Biblioteca para construção de interfaces de usuário
- **TypeScript** – Tipagem estática para maior segurança e escalabilidade
- **TanStack Router** – Roteamento tipado e flexível para React
- **React Query (TanStack Query)** – Gerenciamento de estado assíncrono e cache de dados
- **shadcn/ui** – Componentes de UI acessíveis e estilizados
- **TailwindCSS** – Framework utilitário para estilização rápida e consistente
- **Next.js** _(opcional)_ – Framework React para renderização híbrida (SSR/SSG)

### DevOps / Infraestrutura

- **Docker** – Contêinerização dos serviços backend e frontend
- **Docker Compose** – Orquestração e configuração de múltiplos contêineres
- **Environment Variables (.env)** – Gerenciamento seguro de credenciais e configurações

## 🏗️ Arquitetura

![Alt text](https://i.ibb.co/zht92RS0/Group-2-1.png)

### Fluxo de Dados

1. **Cliente** faz requisição para o frontend Next.js
2. **Frontend** consome a API através do API Gateway
3. **API Gateway** roteia requisições para os serviços apropriados
4. **Serviços** processam a lógica de negócio e acessam o banco de dados
5. **Resposta** retorna pela mesma cadeia até o cliente

## 💻 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- npm ou yarn

### Instalação

1. Clone o repositório

```bash
git clone https://github.com/CDInacio/desafio-fullstack-jungle-gaming.git
cd desafio-fullstack-jungle-gaming
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente

```bash
# Crie um arquivo .env na raiz do projeto
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### Executar com Docker

```bash
# Subir todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar os serviços
docker-compose down
```

### Executar em Desenvolvimento

```bash
# Executar todos os apps
npm run dev

# Executar app específico
npm run dev --filter=web
npm run dev --filter=api-gateway
```

### Build para Produção

```bash
# Build de todos os apps
npm run build

# Build de app específico
npm run build --filter=web
```

## 📁 Estrutura do Projeto

```
desafio-fullstack-jungle-gaming/
│
├── 📁 apps/                                    # Aplicações principais
│   ├── 📁 api-gateway/                         # Gateway da API (NestJS)
│   │   └── src/
│   │       ├── auth/                           # Autenticação
│   │       ├── task/                           # Tarefas
│   │       ├── user/                           # Usuários
│   │       └── websocket/                      # WebSocket
│   │
│   ├── 📁 auth-service/                        # Microsserviço de Auth (NestJS)
│   │   └── src/
│   │       ├── db/migrations/                  # Migrations
│   │       ├── auth/                           # Lógica de autenticação
│   │       └── user/                           # Gerenciamento de usuários
│   │
│   ├── 📁 task-service/                        # Microsserviço de Tarefas (NestJS)
│   │   └── src/
│   │       ├── db/migrations/                  # Migrations
│   │       ├── task/                           # CRUD de tarefas
│   │       ├── assignment/                     # Atribuições
│   │       ├── comment/                        # Comentários
│   │       └── audit/                          # Auditoria
│   │
│   ├── 📁 notification-service/                # Microsserviço de Notificações
│   │   └── src/notification/                   # WebSocket + Socket.io
│   │
│   └── 📁 web/                                 # Frontend (React 19 + Vite)
│       └── src/
│           ├── components/                     # Componentes React
│           ├── routes/                         # Rotas (Tanstack Router)
│           ├── hooks/                          # Custom hooks
│           └── lib/                            # API client + Socket.io
│
├── 📁 packages/                                # Código compartilhado
│   └── 📁 shared/                              # DTOs, Entities, Constants
│       └── src/
│           ├── dto/                            # Data Transfer Objects
│           ├── entities/                       # TypeORM Entities
│           └── constants/                      # Constantes
│
├── 📄 docker-compose.yml                       # Orquestração de containers
├── 📄 turbo.json                               # Config Turborepo (Monorepo)
└── 📄 package.json                             # Root dependencies
```

## 🤔 Decisões Técnicas e Trade-offs

### Monorepo com Turborepo

**Decisão:** Utilizar Turborepo para gerenciar múltiplas aplicações e pacotes compartilhados.

**Vantagens:**

- Compartilhamento de código entre frontend e backend
- Build cache otimizado
- Facilita a manutenção e versionamento

**Trade-offs:**

- Maior complexidade inicial de configuração
- Curva de aprendizado para desenvolvedores não familiarizados
- Builds podem ser mais lentos em projetos muito grandes

### NestJS como API Gateway

**Decisão:** Usar NestJS com arquitetura modular.

**Vantagens:**

- TypeScript nativo
- Arquitetura escalável e testável
- Excelente documentação e ecossistema

**Trade-offs:**

- Pode ser over-engineering para APIs simples
- Requer conhecimento de decorators e injeção de dependências

### Docker para Desenvolvimento

**Decisão:** Containerizar todos os serviços.

**Vantagens:**

- Ambiente consistente entre desenvolvedores
- Facilita deploy
- Isolamento de dependências

**Trade-offs:**

- Overhead de recursos em máquinas com pouca RAM
- Pode dificultar debugging em alguns casos

### [ADICIONE SUAS PRÓPRIAS DECISÕES]

**Exemplo:**

- Por que escolheu PostgreSQL vs MongoDB?
- Por que não usou GraphQL?
- Por que escolheu essa biblioteca de UI específica?

## ⚠️ Problemas Conhecidos e Melhorias Futuras

### Problemas Conhecidos

1. **[Descreva problemas que você identificou]**
   - Exemplo: "Validação de formulários no frontend precisa ser melhorada"
   - Exemplo: "Tratamento de erros na API ainda é genérico"

2. **Performance**
   - Exemplo: "Consultas ao banco de dados sem paginação em algumas rotas"
   - Exemplo: "Imagens não estão otimizadas"

### Melhorias Futuras

- [ ] **Testes:** Implementar testes unitários e E2E (cobertura atual: X%)
- [ ] **CI/CD:** Configurar pipeline de integração e deploy contínuo
- [ ] **Autenticação:** Implementar JWT refresh tokens
- [ ] **Cache:** Adicionar Redis para cache de consultas frequentes
- [ ] **Monitoramento:** Integrar ferramentas de observabilidade (Sentry, DataDog)
- [ ] **Documentação:** Gerar documentação automática da API com Swagger
- [ ] **SEO:** Otimizar meta tags e implementar sitemap
- [ ] **Acessibilidade:** Melhorar score de acessibilidade (WCAG)
- [ ] **Internacionalização:** Adicionar suporte a múltiplos idiomas
- [ ] **[Adicione suas próprias melhorias]**

## ⏱️ Tempo de Desenvolvimento

| Fase                      | Tempo Estimado | Descrição                                        |
| ------------------------- | -------------- | ------------------------------------------------ |
| **Setup Inicial**         | X horas        | Configuração do monorepo, Docker, estrutura base |
| **Backend - API**         | X horas        | Desenvolvimento das rotas, serviços e validações |
| **Backend - Database**    | X horas        | Modelagem, migrations e relacionamentos          |
| **Frontend - UI**         | X horas        | Componentes, páginas e estilização               |
| **Frontend - Integração** | X horas        | Consumo da API e gerenciamento de estado         |
| **Testes**                | X horas        | Testes unitários e de integração                 |
| **Docker & Deploy**       | X horas        | Configuração de containers e documentação        |
| **Documentação**          | X horas        | README, comentários e documentação técnica       |
| **TOTAL**                 | **X horas**    |                                                  |

_Obs: Ajuste os tempos de acordo com sua experiência real_

## 📝 Instruções Específicas

### Variáveis de Ambiente Necessárias

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# API
API_PORT=3001
API_HOST=localhost

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

# [Adicione outras variáveis necessárias]
```

### Rotas da API

| Método | Endpoint             | Descrição    |
| ------ | -------------------- | ------------ |
| GET    | `/api/[recurso]`     | Lista todos  |
| GET    | `/api/[recurso]/:id` | Busca por ID |
| POST   | `/api/[recurso]`     | Cria novo    |
| PUT    | `/api/[recurso]/:id` | Atualiza     |
| DELETE | `/api/[recurso]/:id` | Remove       |
| DELETE | `/api/[recurso]/:id` | Remove       |

_[Documente suas rotas específicas aqui]_

### Scripts Úteis

```bash
# Limpar cache do Turborepo
npm run clean

# Rodar linter
npm run lint

# Formatar código
npm run format

# Verificar tipos TypeScript
npm run type-check
```

## 👤 Autor

**CDInacio**

- GitHub: [@CDInacio](https://github.com/CDInacio)
- [Adicione: LinkedIn, Email, etc.]

## 📄 Licença

[Especifique a licença do projeto - MIT, Apache, etc.]

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
