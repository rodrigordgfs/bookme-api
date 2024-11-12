import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

const secret = process.env.JWT_SECRET;
if (!secret)
  throw new Error("JWT_SECRET não está definido nas variáveis de ambiente.");

const generateToken = (id) => {
  return jwt.sign({ id }, secret, { expiresIn: "7d" });
};

const validateToken = (request, reply, done) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      reply
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Token não fornecido" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      reply
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Formato de token inválido" });
      return;
    }

    const decoded = jwt.verify(token, secret);
    request.userId = decoded.id;
    done();
  } catch (error) {
    reply
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Token inválido ou expirado" });
  }
};

export default {
  generateToken,
  validateToken,
};
