import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const v1Options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TypeScript API',
      version: '1.0.0',
      description: 'API documentation for Express TypeScript application',
    },
    servers: [
      {
        url: '/v1',
        description: 'V1 API',
      },
    ],
  },
  apis: ['./src/docs/v1/*.yml'],
};

const v2Options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TypeScript API',
      version: '1.0.0',
      description: 'API documentation for Express TypeScript application',
    },
    servers: [
      {
        url: '/v2',
        description: 'V2 API',
      },
    ],
  },
  apis: ['./src/docs/v2/*.yml'],
};

const v1Specs = swaggerJsdoc(v1Options);
const v2Specs = swaggerJsdoc(v2Options);
export const setupSwagger = (app: Express): void => {
  /**
   * V1 Docs
   */
  // @ts-expect-error - Express 5类型与swagger-ui-express类型不兼容
  app.use('/v1/docs', swaggerUi.serveFiles(v1Specs), swaggerUi.setup(v1Specs));
  // Docs in JSON format
  app.get('/v1/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(v1Specs);
  });

  /**
   * V2 Docs
   */
  // @ts-expect-error - Express 5类型与swagger-ui-express类型不兼容
  app.use('/v2/docs', swaggerUi.serveFiles(v2Specs), swaggerUi.setup(v2Specs));
  // Docs in JSON format
  app.get('/v2/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(v2Specs);
  });
};
