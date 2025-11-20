import app from './app';
import * as dotenv from 'dotenv';
import { initializeDataSource } from './datasource';

dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * @description Função principal para iniciar o servidor.
 * Primeiro, inicializa a conexão com o banco de dados.
 * Em seguida, inicia o servidor Express para escutar requisições.
 */
async function startServer() {
  try {
    await initializeDataSource();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 Acessível em: http://localhost:${PORT}/api/v1`);
      console.log(`📚 Documentação: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1); 
  }
}

startServer();