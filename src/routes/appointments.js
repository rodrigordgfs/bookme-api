import appointmentsController from "../controllers/appointments.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const appointmentsRoutes = async (fastify) => {
  fastify.post(
    "/appointments",
    { preHandler: authMiddleware.validateToken },
    appointmentsController.postAppointment
  );
  fastify.patch(
    "/appointments/:id_appointment",
    { preHandler: authMiddleware.validateToken },
    appointmentsController.patchAppointment
  );
  fastify.get(
    "/appointments/:id_appointment",
    { preHandler: authMiddleware.validateToken },
    appointmentsController.getAppointmentById
  );
  fastify.get(
    "/appointments",
    { preHandler: authMiddleware.validateToken },
    appointmentsController.getAppointments
  );
  fastify.delete(
    "/appointments/:id_appointment",
    { preHandler: authMiddleware.validateToken },
    appointmentsController.deleteAppointment
  );
};

export default appointmentsRoutes;
