import clientRepository from "../repositories/client.repository.js";
import userRepository from "../repositories/user.repositorie.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error.js";
import { isBase64 } from "../utils/isBase64.js";

const verifyResourceExistence = async (resourceExists, errorMessage) => {
  if (!resourceExists) {
    throw new AppError(errorMessage, StatusCodes.NOT_FOUND);
  }
};

const postClient = async (id_user, phone, birthDate, gender, photo) => {
  const [userExists, clientExists] = await Promise.all([
    userRepository.getUserById(id_user),
    clientRepository.getClientByUserId(id_user),
  ]);

  await verifyResourceExistence(userExists, "User not found");
  if (clientExists) {
    throw new AppError("Client already exists", StatusCodes.CONFLICT);
  }

  const birthDateISO = new Date(birthDate);

  const client = await clientRepository.postClient(
    id_user,
    phone,
    birthDateISO,
    gender,
    photo
  );

  return client
};

const patchClient = async (id, phone, birthDate, gender, photo) => {
  const clientExists = await clientRepository.getClientById(id);
  await verifyResourceExistence(clientExists, "Client not found");

  const birthDateISO = new Date(birthDate);

  const client = await clientRepository.patchClient(
    id,
    phone,
    birthDateISO,
    gender,
    photo
  );

  return client;
};

const getClients = async (name, email, phone, page, perPage) => {
  const clients = await clientRepository.getClients(
    name,
    email,
    phone,
    page,
    perPage
  );
  return clients;
};

const getClientById = async (id) => {
  const clientExists = await clientRepository.getClientById(id);
  await verifyResourceExistence(clientExists, "Client not found");

  const client = await clientRepository.getClientById(id);
  return client;
};

const deleteClient = async (id) => {
  const clientExists = await clientRepository.getClientById(id);
  await verifyResourceExistence(clientExists, "Client not found");

  await clientRepository.deleteClient(id);
};

export default {
  postClient,
  patchClient,
  getClients,
  getClientById,
  deleteClient,
};
