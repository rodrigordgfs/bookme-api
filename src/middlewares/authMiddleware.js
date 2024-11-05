import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

const secret = process.env.JWT_SECRET;

const generateToken = async (id) => {
  const token = jwt.sign({ id }, secret, {
    expiresIn: "7d",
  });

  return token;
};

const validateToken = async (request, reply) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    reply.status(StatusCodes.UNAUTHORIZED).send({ message: "Token not found" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    request.userId = decoded.id;
  } catch (err) {
    reply.status(StatusCodes.UNAUTHORIZED).send({ message: "Token invalid" });
  }
};

export default {
  generateToken,
  validateToken,
};
