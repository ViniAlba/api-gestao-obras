import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { router } from '../src/routes'; // Importamos o nosso roteador principal
import swaggerUi from 'swagger-ui-express';

// Importa o arquivo de especificação (assumindo que está na raiz)
// O require() deve ser feito para carregar o JSON corretamente
const swaggerDocument = require('../swagger.json');


/**
 * @description Classe principal que configura e exporta a aplicação Express.
 */
class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  /**
   * @description Configura os middlewares globais do Express.
   * - CORS: Permite requisições de outras origens (domínios).
   * - JSON: Habilita o Express a processar corpos de requisição em formato JSON.
   */
  private middlewares(): void {
    // Configuração básica do CORS (permite todas as origens por enquanto)
    this.app.use(cors()); 
    
    // Middleware para parsear o corpo da requisição como JSON
    this.app.use(express.json());
  }

  /**
   * @description Configura as rotas da aplicação.
   * Todas as rotas serão prefixadas com '/api/v1', conforme sugerido na documentação.
   * As rotas reais (ex: /empreiteiras) serão definidas no arquivo 'routes/index.ts'.
   */
  private routes(): void {
    // Rota de Documentação (Acessível sem autenticação)
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // A rota base da nossa API
    this.app.use('/api/v1', router);
    
    // Rota de saúde (Health Check)
    this.app.get('/api/v1/health', (req, res) => {
      res.status(200).json({ status: 'OK', uptime: process.uptime() });
    });
  }

  /**
   * @description Configura um middleware para lidar com erros e rotas não encontradas (404).
   */
  private errorHandling(): void {
    // Middleware para rotas não encontradas (404)
    this.app.use((req, res, next) => {
      res.status(404).json({ 
        success: false, 
        message: `Rota não encontrada: ${req.method} ${req.originalUrl}` 
      });
    });

    // Middleware de tratamento de erros (catch-all)
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor.', 
        error: err.message 
      });
    });
  }
}

// Exporta a instância do Express app
export default new App().app;

// Nota: A rota de documentação será acessível em http://localhost:PORT/api-docs