# Monitori.Web

Frontend em Angular para gerenciamento de empreendimentos do sistema Monitori.

## Visão geral

A aplicação permite:

- listar empreendimentos com paginação, ordenação e filtros por nome e status;
- cadastrar novos empreendimentos;
- editar registros existentes;
- inativar empreendimentos;
- exibir notificações de sucesso, erro e informação;
- mostrar indicador de carregamento durante chamadas HTTP.

## Tecnologias

- Angular 21
- TypeScript
- RxJS
- Angular Forms

## Pré-requisitos

- Node.js instalado
- npm 10+ disponível
- API do backend em execução localmente

## Instalação

```bash
npm install
```

## Executando em desenvolvimento

```bash
npm start
```

Depois disso, abra:

```text
http://localhost:4200/
```

## Build de produção

```bash
npm run build
```

O resultado será gerado em `dist/`.

## Testes

```bash
npm test
```

## Scripts disponíveis

- `npm start`: sobe o servidor Angular em modo desenvolvimento;
- `npm run build`: gera o build de produção;
- `npm run watch`: recompila automaticamente em modo desenvolvimento;
- `npm test`: executa os testes unitários.

## Rotas da aplicação

- `/`: listagem de empreendimentos;
- `/novo`: cadastro de empreendimento;
- `/editar/:id`: edição de empreendimento.

## Integração com a API

O frontend consome a API de empreendimentos em:

```text
http://localhost:5041/api/empreendimento
```

Essa configuração está centralizada em [src/app/core/services/empreendimento.service.ts](src/app/core/services/empreendimento.service.ts).

Se o backend estiver em outra URL ou porta, atualize esse arquivo antes de rodar a aplicação.

## Estrutura principal

- [src/app/core](src/app/core): serviços, modelos, interceptors e infraestrutura compartilhada;
- [src/app/features/empreendimentos](src/app/features/empreendimentos): telas de listagem e formulário;
- [src/app/shared/components](src/app/shared/components): componentes reutilizáveis como spinner e notificações.

## Observações

- O formulário aplica validação de CNPJ e bloqueia edição de registros inativos.
- A listagem suporta paginação, ordenação e filtros sem recarregar a página.
