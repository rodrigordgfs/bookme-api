import userRoutes from "./user.js";
import professionalRoutes from "./professional.js";
import serviceRoutes from './service.js'
import clientRoutes from "./client.js";
import appointmentRoutes from "./appointments.js";
import dashboardRoutes from "./dashboard.js";

const routes = async (fastify) => {
  fastify.register(userRoutes);
  fastify.register(professionalRoutes);
  fastify.register(serviceRoutes);
  fastify.register(clientRoutes)
  fastify.register(appointmentRoutes);
  fastify.register(dashboardRoutes);
};

export default routes;
