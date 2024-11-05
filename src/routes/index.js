import userRoutes from "./user.js";
import professionalRoutes from "./professional.js";
import serviceRoutes from './service.js'

const routes = async (fastify) => {
  fastify.register(userRoutes);
  fastify.register(professionalRoutes);
  fastify.register(serviceRoutes);
};

export default routes;
