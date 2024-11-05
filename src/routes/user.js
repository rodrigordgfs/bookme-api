import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const userRoutes = async (fastify) => {
  fastify.post("/auth/register", userController.register);
  fastify.post("/auth/login", userController.login);
  fastify.get(
    "/users/:id",
    { preHandler: authMiddleware.validateToken },
    userController.getUserById
  );
  fastify.patch(
    "/users/:id",
    { preHandler: authMiddleware.validateToken },
    userController.patchUser
  );
  fastify.delete(
    "/users/:id",
    { preHandler: authMiddleware.validateToken },
    userController.deleteUser
  );
};

export default userRoutes;
