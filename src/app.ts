import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { router } from '../src/routes';
import swaggerUi from 'swagger-ui-express';

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
    this.app.use(cors()); 
    
    this.app.use(express.json());
  }

  /**
   * @description Configura as rotas da aplicação.
   * Todas as rotas serão prefixadas com '/api/v1', conforme sugerido na documentação.
   * As rotas reais (ex: /empreiteiras) serão definidas no arquivo 'routes/index.ts'.
   */
  private routes(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    this.app.use('/api/v1', router);
    
    this.app.get('/api/v1/health', (req, res) => {
      res.status(200).json({ status: 'OK', uptime: process.uptime() });
    });
  }

  /**
   * @description Configura um middleware para lidar com erros e rotas não encontradas (404).
   */
  private errorHandling(): void {
    this.app.use((req, res, next) => {
      res.status(404).json({ 
        success: false, 
        message: `Rota não encontrada: ${req.method} ${req.originalUrl}` 
      });
    });

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

export default new App().app;