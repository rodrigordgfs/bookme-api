import authMiddleware from "../middlewares/authMiddleware.js";
import clientController from "../controllers/client.controller.js";

const clientRoutes = async (fastify) => {
  fastify.post(
    "/clients",
    { preHandler: authMiddleware.validateToken },
    clientController.postClient
  );
  fastify.patch(
    "/clients/:id",
    { preHandler: authMiddleware.validateToken },
    clientController.patchClient
  );
  fastify.get(
    "/clients",
    { preHandler: authMiddleware.validateToken },
    clientController.getClients
  );
  fastify.get(
    "/clients/:id",
    { preHandler: authMiddleware.validateToken },
    clientController.getClientById
  );
  fastify.delete(
    "/clients/:id",
    { preHandler: authMiddleware.validateToken },
    clientController.deleteClient
  );
};

export default clientRoutes;
