const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Aula 8',
      version: '1.0.0',
      description: 'Documentação Swagger da API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./server.js'], // Aponta para o arquivo que tem suas rotas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
