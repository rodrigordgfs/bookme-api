import clientRepository from "../repositories/client.repository.js";
import userRepositorie from "../repositories/user.repositorie.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error.js";
import { isValidURL } from "../utils/isValidURL.js";
import { isBase64 } from "../utils/isBase64.js";

const postClient = async (id_user, phone, birthDate, gender, photo) => {
  const userExists = await userRepositorie.getUserById(id_user);
  if (!userExists) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  const clientExists = await clientRepository.getClientByUserId(id_user);
  if (clientExists) {
    throw new AppError("Client already exists", StatusCodes.CONFLICT);
  }

  const birthDateISO = new Date(birthDate);

  const client = await clientRepository.postClient(
    id_user,
    phone,
    birthDateISO,
    gender
  );

  const photoUrl = await clientRepository.uploadClientImage(client.id, photo); 

  return {
    ...client,
    photoUrl
  };
};

const patchClient = async (id, phone, birthDate, gender, photo) => {
  const clientExists = await clientRepository.getClientById(id);
  if (!clientExists) {
    throw new AppError("Client not found", StatusCodes.NOT_FOUND);
  }

  const birthDateISO = new Date(birthDate);

  console.log('isBase64', isBase64(photo));
  

  if (isBase64(photo)) {
    photo = await clientRepository.uploadClientImage(client.id, photo); 
  }

  const client = await clientRepository.patchClient(
    id,
    phone,
    birthDateISO,
    gender,
    photo
  );

  return {
    ...client,
    photoURL: photo,
  };
};


const getClients = async () => {
  const clients = await clientRepository.getClients();
  return clients;
};

const getClientById = async (id) => {
  const clientExists = await clientRepository.getClientById(id);
  if (!clientExists) {
    throw new AppError("Client not found", StatusCodes.NOT_FOUND);
  }

  const client = await clientRepository.getClientById(id);
  return client;
};

const deleteClient = async (id) => {
  const clientExists = await clientRepository.getClientById(id);
  if (!clientExists) {
    throw new AppError("Client not found", StatusCodes.NOT_FOUND);
  }

  await clientRepository.deleteClient(id);
};

export default {
  postClient,
  patchClient,
  getClients,
  getClientById,
  deleteClient,
};
