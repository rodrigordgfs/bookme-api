import { prisma } from "../libs/prisma.js";
import { supabase } from "../libs/supabase.js";

const postClient = async (id_user, phone, birthDate, gender) => {
  try {
    const client = await prisma.client.create({
      data: {
        user: {
          connect: { id: id_user },
        },
        phone,
        birthDate,
        gender,
      },
      select: {
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
      },
    });
    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const patchClient = async (id, phone, birthDate, gender, photoUrl) => {
  try {
    const client = await prisma.client.update({
      where: {
        id,
      },
      data: {
        phone,
        birthDate,
        gender,
        photoUrl
      },
      select: {
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
      },
    });
    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getClients = async () => {
  try {
    const clients = await prisma.client.findMany({
      select: {
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
      },
    });
    return clients;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getClientById = async (id) => {
  try {
    const client = await prisma.client.findUnique({
      where: {
        id,
      },
      select: {
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
      },
    });
    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getClientByUserId = async (id_user) => {
  try {
    const client = await prisma.client.findFirst({
      where: {
        user: {
          id: id_user,
        },
      },
      select: {
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
      },
    });
    return client;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteClient = async (id) => {
  try {
    return await prisma.client.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const uploadClientImage = async (id_client, photoBase64) => {
  try {
    const match = photoBase64.match(/^data:image\/(\w+);base64,/);
    const extension = match ? match[1] : "jpeg";

    const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `client/${id_client}.${extension}`;

    const { data: existingFile, error: getError } = await supabase.storage
      .from("clients")
      .list("client", { search: `${id_client}.${extension}` });

    if (getError) {
      console.error("Erro ao buscar arquivo existente:", getError);
      throw getError;
    }

    if (existingFile && existingFile.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from("clients")
        .remove([fileName]);

      if (deleteError) {
        console.error("Erro ao excluir arquivo existente:", deleteError);
        throw deleteError;
      }
    }

    const { data, error } = await supabase.storage
      .from("clients")
      .upload(fileName, buffer, {
        contentType: `image/${extension}`,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw error;
    }

    const newPhoto = supabase.storage
      .from("clients")
      .getPublicUrl(fileName);

    await prisma.client.update({
      where: {
        id: id_client,
      },
      data: {
        photoUrl: newPhoto.data['publicUrl'],
      },
    });
    console.log("URL da imagem:", newPhoto.data['publicUrl']);
    
    return newPhoto.data['publicUrl'];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default {
  postClient,
  patchClient,
  getClients,
  getClientById,
  deleteClient,
  getClientByUserId,
  uploadClientImage,
};
