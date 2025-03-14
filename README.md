# Sistema de Recomendação de Filmes

## Descrição

Este projeto tem como objetivo criar um sistema de recomendação de filmes, utilizando dados de preferências dos usuários para sugerir filmes. Ele foi desenvolvido como parte de um projeto acadêmico.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Frontend**: TypeScript, SCSS, Next.js
- **Banco de Dados**: MongoDB
- **Autenticação**: JWT
- **API Externa**: TMDB API

## Funcionalidades

- Registro de filmes curtidos pelos usuários.
- Recomendação de filmes baseada em gostos pessoais.
- Exibição de filmes mais curtidos na plataforma.

## Estrutura do Projeto

### /backend/
- **/dist/**: Diretório de produção, contendo a versão compilada do código.
  - **/middleware**: Funções intermediárias para processamento de requisições.
  - **/models**: Modelos de dados (ex: filmes, usuários).
  - **/routes**: Definição das rotas de API.
  - **populate.js**: Script para popular o banco de dados com dados iniciais.
  - **server.js**: Arquivo principal que inicia o servidor.

- **/src/**: Código-fonte em desenvolvimento.
  - **/middleware**: Funções intermediárias.
  - **/models**: Modelos de dados.
  - **/routes**: Definição das rotas.
  - **populate.ts**: Script para popular o banco de dados em TypeScript.
  - **server.ts**: Arquivo principal do servidor em TypeScript.

### /frontend/
- **/app/**: Lógica e estrutura da aplicação.
  - **/routes/**: Definição das rotas da aplicação.
  - **/service/**: Serviços responsáveis pela comunicação com o backend.

- **/components/**: Componentes reutilizáveis para a interface de usuário.
- **/types/**: Tipos TypeScript utilizados no projeto.


## Como Rodar o Projeto

### Requisitos

- Node.js
- MongoDB

### Backend

1. Clone o repositório.
2. Acesse a pasta `backend`.
3. Instale as dependências: `npm install`.
4. Execute o servidor: `npm start`.

### Frontend

1. Acesse a pasta `frontend`.
2. Instale as dependências: `npm install`.
3. Execute o servidor: `npm run dev`.

## Licença

Este projeto é licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

