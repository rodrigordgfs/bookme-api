import professionalController from "../controllers/professional.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const professionalRoutes = async (fastify) => {
  fastify.post(
    "/professionals",
    { preHandler: authMiddleware.validateToken },
    professionalController.postProfessional
  );
  fastify.patch(
    "/professionals/:id",
    { preHandler: authMiddleware.validateToken },
    professionalController.patchProfessional
  );
  fastify.get(
    "/professionals/:id",
    { preHandler: authMiddleware.validateToken },
    professionalController.getProfessionalById
  );
  fastify.get(
    "/professionals",
    { preHandler: authMiddleware.validateToken },
    professionalController.getProfessionals
  );
  fastify.delete(
    "/professionals/:id",
    { preHandler: authMiddleware.validateToken },
    professionalController.deleteProfessional
  );
  fastify.post(
    "/professionals/:id_professional/service/:id_service",
    { preHandler: authMiddleware.validateToken },
    professionalController.postProfessionalService
  );
  fastify.get(
    "/professionals/:id_professional/services",
    { preHandler: authMiddleware.validateToken },
    professionalController.getProfessionalServices
  );
  fastify.delete(
    "/professionals/:id_professional/service/:id_service",
    { preHandler: authMiddleware.validateToken },
    professionalController.deleteProfessionalService
  );
};

export default professionalRoutes;
