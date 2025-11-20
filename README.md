# API de Gestão de Obras

API RESTful para gerenciamento de obras, desenvolvida com Node.js, TypeScript, Express e TypeORM.

## Funcionalidades

- **Autenticação e Segurança:** Login e Registro com JWT (JSON Web Token) e hash de senha com Bcrypt.
- **Gestão de Clientes:** Cadastro completo de clientes.
- **Gestão de Engenheiros:** Controle de engenheiros e CREA.
- **Gestão de Obras:** Controle de projetos, vinculados a clientes e engenheiros.
- **Gestão de Trabalhadores:** Cadastro de funcionários com hierarquia (Gerentes e Subordinados).

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- JWT (jsonwebtoken)
- Swagger (Documentação)
- Jest (Testes Unitários)

## Instalação e Configuração

### 1. Clone o repositório
```bash
git clone [https://github.com/ViniAlba/api-gestao-obras.git](https://github.com/ViniAlba/api-gestao-obras.git)
cd api-gestao-obras
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
PORT=3000
JWT_SECRET=sua_chave_super_secreta
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_do_banco
DB_NAME=gestao_obras
TZ=America/Sao_Paulo
```

4. Crie um banco de dados no postgres com o nome "gestao_obras"
```sql
CREATE DATABASE gestao_obras;
```

5. Execute as migrações para criar as tabelas
```bash
npm run typeorm -- migration:run
```

6. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

7. Para garantir a integridade do código, execute os testes unitários com Jest
```bash
npm test
```

## Documentação da API

A documentação completa da API está disponível através do Swagger UI em:
```
http://localhost:3000/api-docs
```

## Rotas Principais

- `POST /api/v1/auth/login` - Entrar e receber Token JWT
- `POST /api/v1/auth/register` - Registro de novo usuário
- `GET /api/v1/clientes` - Lista todos os clientes
- `GET /api/v1/obras` - Lista todas as obras
- `GET /api/v1/engenheiros` - Lista todos os engenheiros
- `GET /api/v1/trabalhadores` - Lista todos os trabalhadores

## Scripts Disponíveis

- ```npm run dev```: Inicia o servidor em modo de desenvolvimento (com auto-reload).
- ```npm run build```: Compila o TypeScript para JavaScript na pasta dist.
- ```npm start```: Inicia o servidor de produção (pasta dist).
- ```npm test```: Roda os testes unitários.
- ```npm run typeorm -- migration:generate src/migrations/Nome```: Gera uma nova migração baseada em mudanças nos Models.
- ```npm run typeorm -- migration:run```: Aplica as migrações pendentes no banco.

## Contribuição

1. Faça o fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
