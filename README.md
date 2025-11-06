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

Esse projeto é um Sistema de Gestão de Tarefas Colaborativo, desenvolvido como desafio técnico full-stack para a vaga de Desenvolvedor Júnior na Jungle Gaming. O objetivo foi criar uma aplicação completa de gestão de tarefas colaborativa, com autenticação, CRUD de tarefas, comentários, atribuição de usuários, e notificações em tempo real — tudo estruturado em microserviços que se comunicam via RabbitMQ.

## 🚀 Tecnologias Utilizadas

### Backend

- **NestJS** – Framework Node.js progressivo para construção de APIs escaláveis
- **TypeScript** – Superset do JavaScript com tipagem estática
- **TypeORM** – ORM para modelagem e comunicação com o banco de dados
- **PostgreSQL** – Banco de dados relacional principal
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

### DevOps / Infraestrutura

- **Docker** – Contêinerização dos serviços backend e frontend
- **Docker Compose** – Orquestração e configuração de múltiplos contêineres
- **Environment Variables (.env)** – Gerenciamento seguro de credenciais e configurações

## 🏗️ Arquitetura

![Alt text](https://i.ibb.co/zht92RS0/Group-2-1.png)

### Fluxo de Dados

1. **Cliente** faz requisição para o frontend
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

### Context API em vez de Zustand

**Decisão:** Utilizar React Context API para gerenciamento de estados globais, em vez de bibliotecas externas como Zustand.

**Trade-offs:**

- Pode gerar re-renderizações desnecessárias em componentes complexos
- Menos performático em estados globais muito grandes

### React Query (TanStack Query) em vez de useEffect + useState

**Decisão:** Usar React Query para o gerenciamento de estado assíncrono e cache de dados, substituindo o uso manual de useEffect e useState para requisições.

**Vantagens:**

- Cache e sincronização automáticos
- Revalidação de dados em segundo plano

**Trade-offs:**

- Curva de aprendizado maior no início

### Não utilização do turbo prune

**Decisão:** Optei por não utilizar o comando turbo prune nos builds do Docker, devido a dificuldades técnicas durante a configuração.

**Trade-offs:**

- Imagens Docker maiores e builds mais lentos

## ⚠️ Problemas Conhecidos e Melhorias Futuras

### Problemas Conhecidos

1. **Builds Docker não otimizados**
   - Os `Dockerfile` atuais não utilizam o comando `turbo prune`, o que aumenta o tamanho final das imagens e o tempo de build.
   - **Impacto:** builds mais lentos e imagens mais pesadas do que o necessário.

2. **Implementação do Refresh Token incompleta**
   - O fluxo de **refresh token JWT** foi iniciado, mas ainda não está totalmente implementado.
   - **Impacto:** sessões expiram após o tempo de validade do access token, exigindo novo login manual do usuário.

### Melhorias Futuras

- [ ] **Autenticação:** Finalizar o fluxo de refresh tokens JWT
- [ ] **Builds Docker:** Otimizar Dockerfiles com `turbo prune`

## ⏱️ Tempo de Desenvolvimento (aproximadamente)

| Fase                      | Tempo Estimado | Descrição                                          |
| ------------------------- | -------------- | -------------------------------------------------- |
| **Setup Inicial**         | 4 horas        | Configuração do monorepo, Docker, estrutura base   |
| **Backend - API**         | 25 horas       | Desenvolvimento das rotas, serviços e validações   |
| **Backend - DB**          | 8 horas        | Modelagem, migrations e relacionamentos, entidades |
| **Frontend - UI**         | 15 horas       | Componentes, páginas e estilização                 |
| **Frontend - Integração** | 20 horas       | Consumo da API e gerenciamento de estado           |
| **Documentação**          | 2 horas        | README, comentários e documentação técnica         |
| **TOTAL**                 | **74 horas**   |                                                    |

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
- Linkedin: [\claudio-dantas](https://www.linkedin.com/in/cl%C3%A1udio-dantas-520a1615b/)
