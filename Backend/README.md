# Monitori Backend

API backend do projeto Monitori, desenvolvida em .NET 8 com arquitetura em camadas.
O sistema expoe um CRUD de Empreendimentos, usa SQLite como banco local e aplica as migracoes automaticamente na inicializacao.

## Tecnologias

- .NET 8 / ASP.NET Core Web API
- Entity Framework Core
- SQLite
- Swagger / OpenAPI
- CORS liberado para `http://localhost:4200`

## Estrutura do projeto

- `Monitori.API` - camada de apresentacao, controllers, middleware e configuracao da API
- `Monitori.Application` - DTOs, contratos e servicos da aplicacao
- `Monitori.Domain` - entidades, enums, excecoes e contratos do dominio
- `Monitori.Infrastructure` - DbContext, mapeamentos EF Core e repositórios

## Requisitos

- .NET SDK 8.0
- Opcional: SQLite Browser para inspecionar o arquivo do banco `monitori.db`

## Como executar

1. Restaure as dependencias:

```bash
dotnet restore Monitori.sln
```

2. Execute a API:

```bash
dotnet run --project Monitori.API/Monitori.API.csproj
```

3. Acesse o Swagger em desenvolvimento:

- `http://localhost:5041/swagger`
- `https://localhost:7295/swagger`

## Banco de dados

Por padrao, a aplicacao usa o arquivo SQLite `monitori.db` definido em `Monitori.API/appsettings.json`.
Ao subir a API, o projeto aplica automaticamente as migracoes pendentes.

Se for necessario recriar o banco, basta remover o arquivo `monitori.db` e iniciar a API novamente.

## Dominio atendido

O backend atualmente trabalha com a entidade `Empreendimento`, que possui:

- `Id`
- `Nome`
- `CNPJ`
- `Endereco`
- `Status` (`Ativo` ou `Inativo`)
- `DataCriacao`

Regras principais:

- `Nome` e `CNPJ` sao obrigatorios na criacao
- `Nome` deve ter no minimo 3 caracteres
- `CNPJ` precisa conter exatamente 14 digitos numericos
- nao e permitido cadastrar dois empreendimentos com o mesmo CNPJ
- edicao so e permitida para empreendimentos ativos

## Endpoints

Base route: `/api/empreendimento`

### `POST /api/empreendimento`

Cria um novo empreendimento.

Exemplo de corpo:

```json
{
  "nome": "Empreendimento Alfa",
  "cnpj": "12345678000199",
  "endereco": "Rua Exemplo, 123"
}
```

### `PUT /api/empreendimento/{id}`

Atualiza nome e endereco de um empreendimento ativo.

Exemplo de corpo:

```json
{
  "nome": "Empreendimento Alfa Atualizado",
  "endereco": "Rua Exemplo, 456"
}
```

### `DELETE /api/empreendimento/{id}`

Inativa um empreendimento.

### `GET /api/empreendimento/{id}`

Busca um empreendimento pelo id.

### `GET /api/empreendimento`

Lista empreendimentos com paginação, filtro e ordenacao.

Query params disponiveis:

- `nome`
- `status`
- `pageNumber`
- `pageSize`
- `sortBy` (`Nome` ou `DataCriacao`)
- `sortOrder` (`asc` ou `desc`)

Exemplo:

```text
/api/empreendimento?nome=alfa&status=Ativo&pageNumber=1&pageSize=10&sortBy=Nome&sortOrder=asc
```

## Respostas e erros

O projeto usa um middleware global para tratar excecoes e retornar respostas em JSON no formato:

```json
{
  "error": "mensagem da falha"
}
```

Erros de regra de negocio retornam `400 Bad Request`. Quando o item nao e encontrado, a API retorna `404 Not Found`.

## Observacoes de integracao

- A API ja esta configurada para aceitar requisicoes do frontend Angular em `http://localhost:4200`
- O projeto inclui Swagger no ambiente de desenvolvimento
- O arquivo `Monitori.API.http` pode ser usado para testes manuais no VS Code
