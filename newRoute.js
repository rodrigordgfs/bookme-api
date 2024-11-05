// createEndpoint.js
import fs from 'fs';
import path from 'path';

const createEndpoint = (routeName) => {
  // Nome formatado
  const formattedName = routeName.toLowerCase();

  // Diretórios
  const folders = {
    controller: `./src/controllers/${formattedName}.controller.js`,
    service: `./src/services/${formattedName}.service.js`,
    repository: `./src/repositories/${formattedName}.repository.js`,
    route: `./src/routes/${formattedName}.js`,
  };

  // Templates de cada arquivo
  const templates = {
    controller: `// ${formattedName}.controller.js
const controller = async (request, reply) => {
  // Implementação do controller
};

export default {
  controller
};`,
    
    service: `// ${formattedName}.service.js
const service = async (request, reply) => {
  // Implementação do serviço
};

export default {
  service
};`,

    repository: `// ${formattedName}.repository.js
import { prisma } from "../libs/prisma.js";

const repository = async () => {
  // Implementação do repositório
};

export default {
  repository
};`,

    route: `// ${formattedName}.js
import authMiddleware from "../middlewares/authMiddleware.js";

const ${formattedName}Routes = async (fastify) => {
  // Definição das rotas usando Fastify
};

export default ${formattedName}Routes;
`
  };

  // Função para criar arquivos e pastas
  for (const [key, filePath] of Object.entries(folders)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, templates[key]);
    console.log(`${key} criado: ${filePath}`);
  }
};

// Função auxiliar para capitalizar o nome
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Executar o script com o nome da rota como argumento
const [,, routeName] = process.argv;
if (!routeName) {
  console.log('Por favor, forneça o nome da rota como argumento.');
  process.exit(1);
}

createEndpoint(routeName);
