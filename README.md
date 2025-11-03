# Desafio Fullstack — Jungle Gaming

Este repositório contém a solução do desafio fullstack para Jungle Gaming. O objetivo do README é documentar como executar, testar e entender as decisões técnicas tomadas no projeto, além de listar problemas conhecidos, melhorias propostas e o tempo gasto em cada parte.

## Arquitetura

O sistema foi projetado seguindo uma arquitetura de microserviços orientada a eventos, utilizando um monorepo gerenciado pelo Turborepo. A arquitetura é composta por:

- Frontend com React e TypeScript
- Api Gatway
  - Funciona como um pronto de entrada único de requisições
- 3 Microserviços
  - Auth Service (serviço de autenticação)
  - Task Service (serviço para CRUD de tarefas)
  - Notification Service (serviço de notificações)
- Message Broker (RabbitMQ) para comunicação assíncrona entre os serviços
- Banco de dados PostgreSQL

#### Principios da arquitetura

- Separação de conceitos (Separation of concerns): Cada serviço possui uma responsabilidade única e bem definida.
- Arquitetura Orientada a Eventos (EDA):
- Api Gateway:
- Monorepo:

#### Diagrama da Arquitetura

---

## Decisões técnicas e trade-offs

---

## Problemas Conhecidos e o que Melhoraria

- Falta de cobertura de testes
  - O que melhorar: adicionar testes de integração
