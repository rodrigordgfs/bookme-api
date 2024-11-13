import { prisma } from "../libs/prisma.js";
import { supabase } from "../libs/supabase.js";

const clientSelectFields = {
  id: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  phone: true,
  birthDate: true,
  gender: true,
  photoUrl: true,
  createdAt: true,
  updatedAt: true,
};

const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

const postClient = async (id_user, phone, birthDate, gender) => {
  try {
    return await prisma.client.create({
      data: {
        user: { connect: { id: id_user } },
        phone,
        birthDate,
        gender,
      },
      select: clientSelectFields,
    });
  } catch (error) {
    handleError(error, "Erro ao criar cliente");
  }
};

const patchClient = async (id, phone, birthDate, gender, photoUrl) => {
  try {
    return await prisma.client.update({
      where: { id },
      data: { phone, birthDate, gender, photoUrl },
      select: clientSelectFields,
    });
  } catch (error) {
    handleError(error, "Erro ao atualizar cliente");
  }
};

const getClients = async (name, email, phone) => {
  try {
    const conditions = [
      name ? { user: { name: { contains: name, mode: "insensitive" } } } : undefined,
      email ? { email: { contains: email, mode: "insensitive" } } : undefined,
      phone ? { phone: { contains: phone, mode: "insensitive" } } : undefined,
    ].filter(Boolean);

    return await prisma.client.findMany({
      select: clientSelectFields,
      where: conditions.length > 0 ? { OR: conditions } : undefined,
    });
  } catch (error) {
    handleError(error, "Erro ao obter lista de clientes");
  }
};



const getClientById = async (id) => {
  try {
    return await prisma.client.findUnique({
      where: { id },
      select: clientSelectFields,
    });
  } catch (error) {
    handleError(error, "Erro ao obter cliente por ID");
  }
};

const getClientByUserId = async (id_user) => {
  try {
    return await prisma.client.findFirst({
      where: { user: { id: id_user } },
      select: clientSelectFields,
    });
  } catch (error) {
    handleError(error, "Erro ao obter cliente por ID do usuário");
  }
};

const deleteClient = async (id) => {
  try {
    return await prisma.client.delete({ where: { id } });
  } catch (error) {
    handleError(error, "Erro ao deletar cliente");
  }
};

const uploadClientImage = async (id_client, photoBase64) => {
  try {
    const { extension, buffer } = processImageBase64(photoBase64, id_client);
    const fileName = `client/${id_client}.${extension}`;

    await deleteExistingFile(fileName);

    const { data, error } = await supabase.storage
      .from("clients")
      .upload(fileName, buffer, {
        contentType: `image/${extension}`,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw new Error("Erro ao fazer upload da imagem");

    const newPhotoUrl = supabase.storage.from("clients").getPublicUrl(fileName)
      .data.publicUrl;

    await prisma.client.update({
      where: { id: id_client },
      data: { photoUrl: newPhotoUrl },
    });

    console.log("URL da imagem:", newPhotoUrl);
    return newPhotoUrl;
  } catch (error) {
    handleError(error, "Erro ao fazer upload da imagem do cliente");
  }
};

const processImageBase64 = (photoBase64, id_client) => {
  const match = photoBase64.match(/^data:image\/(\w+);base64,/);
  const extension = match ? match[1] : "jpeg";
  const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  return { extension, buffer };
};

const deleteExistingFile = async (fileName) => {
  const { data: existingFile, error: getError } = await supabase.storage
    .from("clients")
    .list("client", { search: fileName });

  if (getError) {
    throw new Error("Erro ao buscar arquivo existente");
  }

  if (existingFile && existingFile.length > 0) {
    const { error: deleteError } = await supabase.storage
      .from("clients")
      .remove([fileName]);
    if (deleteError) {
      throw new Error("Erro ao excluir arquivo existente");
    }
  }
};

export default {
  postClient,
  patchClient,
  getClients,
  getClientById,
  getClientByUserId,
  deleteClient,
  uploadClientImage,
};
