import app from './app';
import * as dotenv from 'dotenv';
import { initializeDataSource } from './datasource';

// Carregar variáveis de ambiente
dotenv.config();

// Obtém a porta do arquivo .env ou usa 3000 como padrão
const PORT = process.env.PORT || 3000;

/**
 * @description Função principal para iniciar o servidor.
 * Primeiro, inicializa a conexão com o banco de dados.
 * Em seguida, inicia o servidor Express para escutar requisições.
 */
async function startServer() {
  try {
    // 1. Inicializa o banco de dados
    // Garantimos que a conexão está OK antes de iniciar o servidor
    await initializeDataSource();

    // 2. Inicia o servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 Acessível em: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    // Encerra o processo se houver falha na inicialização da DB
    process.exit(1); 
  }
}

startServer();