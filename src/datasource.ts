import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Carregar variáveis de ambiente do .env
dotenv.config();

// Define se o ambiente é de produção (rodando .js) ou desenvolvimento (rodando .ts)
const isProduction = process.env.NODE_ENV === 'production';
const rootDir = isProduction ? 'dist' : 'src';

const dataSourceInstance = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME, // Corrigido para o padrão usado no projeto
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // Corrigido para o padrão usado no projeto
  
  extra: {
      timezone: 'America/Sao_Paulo',
    },

  // Em desenvolvimento, synchronize: true pode ser útil para criar tabelas automaticamente.
  // Para produção, use migrations.
  synchronize: !isProduction, // Sincroniza se NÃO for produção.
  migrationsRun: isProduction, // Rodar migrations automaticamente em produção
  
  // Caminhos dinâmicos que funcionam tanto em dev (.ts) quanto em prod (.js)
  entities: [join(rootDir, 'models', '**', '*.model.{ts,js}').replace(/\\/g, '/')],
  migrations: [join(rootDir, 'migrations', '**', '*{.ts,js}').replace(/\\/g, '/')],
  
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

/**
 * @description Exportação principal do DataSource para ser usado no CLI (export default).
 */
//export default dataSourceInstance; 

/**
 * @description Exportação nomeada para ser usado no nosso código (AppDataSource).
 */
export const AppDataSource = dataSourceInstance;


/**
 * @description Função auxiliar para inicializar o DataSource e verificar a conexão.
 * Usa a exportação nomeada AppDataSource.
 */
export const initializeDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize(); 
      console.log('🌿 Fonte de dados inicializada com sucesso!');
    } catch (error) {
      console.error('❌ Falha ao inicializar a fonte de dados:', error);
      throw error;
    }
  }
  return AppDataSource;
};