import userController from "./controllers/user.controller.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const routes = async (fastify, options) => {
  fastify.post("/users/register", userController.register);
  fastify.post("/users/login", userController.login);
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
};

export default routes;
