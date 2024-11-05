import serviceController from "../controllers/service.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const serviceRoutes = async (fastify) => {
  fastify.post(
    "/services",
    { preHandler: authMiddleware.validateToken },
    serviceController.postService
  );
  fastify.patch(
    "/services/:id",
    { preHandler: authMiddleware.validateToken },
    serviceController.patchService
  );
  fastify.get(
    "/services",
    { preHandler: authMiddleware.validateToken },
    serviceController.getServices
  );
  fastify.get(
    "/services/:id",
    { preHandler: authMiddleware.validateToken },
    serviceController.getServiceById
  );
  fastify.delete(
    "/services/:id",
    { preHandler: authMiddleware.validateToken },
    serviceController.deleteService
  );
};

export default serviceRoutes;
