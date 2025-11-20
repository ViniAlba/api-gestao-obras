# API de Gestão de Obras

API RESTful para gerenciamento de obras, desenvolvida com Node.js, TypeScript, Express e TypeORM.

## Funcionalidades

- Autenticação JWT
- Gestão de Clientes
- Gestão de Engenheiros
- Gestão de Obras
- Gestão de Trabalhadores

## Tecnologias

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- JWT para autenticação
- Swagger para documentação
- Jest para testes unitários

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/api-gestao-obras.git
cd api-gestao-obras
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Crie um banco de dados no postgres com o nome "gestao_obras"
```sql
CREATE DATABASE gestao_obras;
```

5. Gere a migration do typeorm e, em seguida, inicialize-a
```bash
npm run typeorm:migration:generate
npm run typeorm:migration:run
```

6. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## Documentação da API

A documentação completa da API está disponível através do Swagger UI em:
```
http://localhost:3000/api-docs
```

## Rotas Principais

- `POST /api/v1/auth/login` - Login de usuário
- `POST /api/v1/auth/register` - Registro de novo usuário
- `GET /api/v1/clientes` - Lista todos os clientes
- `GET /api/v1/obras` - Lista todas as obras
- `GET /api/v1/engenheiros` - Lista todos os engenheiros
- `GET /api/v1/trabalhadores` - Lista todos os trabalhadores

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o projeto
- `npm start` - Inicia o servidor em modo produção

## Contribuição

1. Faça o fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
