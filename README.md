# Projeto Monitore

Aplicação full stack para gestão de empreendimentos, com backend em ASP.NET Core 8, banco SQLite via Entity Framework Core e frontend em Angular 21.

## Estrutura

- `Backend/Monitori.sln` - solução .NET com os projetos `Monitori.API`, `Monitori.Application`, `Monitori.Domain` e `Monitori.Infrastructure`.
- `Frontend/Monitori.Web` - aplicação Angular.

## Pré-requisitos

- .NET SDK 8.0 ou superior
- Node.js 20 ou superior
- npm

## Como executar

### Backend

1. Abra um terminal na pasta `Backend`.
2. Restaure e execute a API:

```bash
dotnet restore
dotnet run --project Monitori.API/Monitori.API.csproj
```

A API aplica as migrações automaticamente na inicialização e usa SQLite com o arquivo `monitori.db`.

### Frontend

1. Abra um terminal na pasta `Frontend/Monitori.Web`.
2. Instale as dependências e inicie o Angular:

```bash
npm install
npm start
```

O frontend fica disponível em `http://localhost:4200/`.

## API

O endpoint principal de empreendimentos fica em `api/empreendimento`.

- `GET /api/empreendimento` - lista paginada
- `GET /api/empreendimento/{id}` - busca por id
- `POST /api/empreendimento` - cria um empreendimento
- `PUT /api/empreendimento/{id}` - atualiza um empreendimento
- `DELETE /api/empreendimento/{id}` - inativa um empreendimento

Em desenvolvimento, o Swagger fica disponível na API.

## Observações

- O backend libera CORS para `http://localhost:4200`.
- O arquivo de banco `monitori.db` é gerado localmente e não deve ser versionado.
- Os diretórios `bin`, `obj`, `node_modules` e `dist` são artefatos gerados e devem ficar fora do Git.
