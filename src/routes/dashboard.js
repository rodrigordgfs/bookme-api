import dashboardController from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const dashboardRoutes = async (fastify) => {
  fastify.get(
    "/dashboard/total-month",
    { preHandler: authMiddleware.validateToken },
    dashboardController.getDashboardTotalMonth
  );
  fastify.get(
    "/dashboard/appointments-month",
    { preHandler: authMiddleware.validateToken },
    dashboardController.getDashboardAppointmentsMonth
  );
  fastify.get(
    "/dashboard/appointments-day",
    { preHandler: authMiddleware.validateToken },
    dashboardController.getDashboardAppointmentsDay
  );
  fastify.get(
    "/dashboard/appointments-interval",
    { preHandler: authMiddleware.validateToken },
    dashboardController.getDashboardAppointmentsInterval
  );
  fastify.get(
    "/dashboard/services-interval",
    { preHandler: authMiddleware.validateToken },
    dashboardController.getDashboardServicesInterval
  );
};

export default dashboardRoutes;
