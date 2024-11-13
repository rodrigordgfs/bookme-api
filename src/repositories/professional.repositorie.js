import { prisma } from "../libs/prisma.js";
import { supabase } from "../libs/supabase.js";

const baseProfessionalSelect = {
  id: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  photoUrl: true,
  specialty: true,
  createdAt: true,
  updatedAt: true,
};

const handleError = (error) => {
  console.error(error);
  throw error;
};

const postProfessional = async (user_id, specialty, photoUrl) => {
  try {
    return await prisma.professional.create({
      data: {
        user: {
          connect: { id: user_id },
        },
        specialty,
        photoUrl,
      },
      select: baseProfessionalSelect,
    });
  } catch (error) {
    handleError(error);
  }
};

const getProfessionalById = async (id) => {
  try {
    return await prisma.professional.findUnique({
      where: { id },
      select: baseProfessionalSelect,
    });
  } catch (error) {
    handleError(error);
  }
};

const getProfessionals = async (service, name, email, specialty) => {
  try {
    const conditions = [
      name ? { user: { name: { contains: name, mode: "insensitive" } } } : undefined,
      email ? { email: { contains: email, mode: "insensitive" } } : undefined,
      specialty ? { specialty: { contains: specialty, mode: "insensitive" } } : undefined,
    ].filter(Boolean);

    return await prisma.professional.findMany({
      select: {
        ...baseProfessionalSelect,
        ...(service && {
          ProfessionalService: {
            select: {
              id: true,
              service: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  price: true,
                  duration: true,
                },
              },
            },
          },
        }),
      },
      where: conditions.length > 0 ? { OR: conditions } : undefined,
    });
  } catch (error) {
    handleError(error);
  }
};

const getProfessionalByUserId = async (userId) => {
  try {
    return await prisma.professional.findUnique({
      where: { userId },
      select: baseProfessionalSelect,
    });
  } catch (error) {
    handleError(error);
  }
};

const patchProfessional = async (id, specialty, photoUrl) => {
  try {
    return await prisma.professional.update({
      where: { id },
      data: { specialty, photoUrl },
      select: baseProfessionalSelect,
    });
  } catch (error) {
    handleError(error);
  }
};

const deleteProfessional = async (id) => {
  try {
    return await prisma.professional.delete({
      where: { id },
    });
  } catch (error) {
    handleError(error);
  }
};

const getProfessionalServiceByIdProfessionalIdService = async (
  professionalId,
  serviceId
) => {
  try {
    return await prisma.professionalService.findUnique({
      where: {
        professionalId_serviceId: { professionalId, serviceId },
      },
      select: {
        id: true,
        professional: { select: baseProfessionalSelect },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    handleError(error);
  }
};

const getProfessionalServiceById = async (id) => {
  try {
    return await prisma.professionalService.findUnique({
      where: { id },
      select: {
        id: true,
        professional: { select: baseProfessionalSelect },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    handleError(error);
  }
};

const getProfessionalServiceByIdProfessional = async (professionalId) => {
  try {
    return await prisma.professionalService.findMany({
      where: { professionalId },
      select: {
        id: true,
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    handleError(error);
  }
};

const postProfessionalService = async (professionalId, serviceId) => {
  try {
    return await prisma.professionalService.create({
      data: {
        professional: { connect: { id: professionalId } },
        service: { connect: { id: serviceId } },
      },
      select: {
        id: true,
        professional: { select: baseProfessionalSelect },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    handleError(error);
  }
};

const deleteProfessionalService = async (professionalId, serviceId) => {
  try {
    return await prisma.professionalService.delete({
      where: {
        professionalId_serviceId: { professionalId, serviceId },
      },
    });
  } catch (error) {
    handleError(error);
  }
};

const uploadProfessionalImage = async (professionalId, photoBase64) => {
  try {
    const extension =
      photoBase64.match(/^data:image\/(\w+);base64,/)?.[1] || "jpeg";
    const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `professional/${professionalId}.${extension}`;

    const { data: existingFile } = await supabase.storage
      .from("professionals")
      .list("professional", { search: `${professionalId}.${extension}` });
    if (existingFile?.length) {
      await supabase.storage.from("professionals").remove([fileName]);
    }

    const { data, error } = await supabase.storage
      .from("professionals")
      .upload(fileName, buffer, {
        contentType: `image/${extension}`,
        cacheControl: "3600",
        upsert: false,
      });
    if (error) throw error;

    const newPhotoUrl = supabase.storage
      .from("professionals")
      .getPublicUrl(fileName).data.publicUrl;

    await prisma.professional.update({
      where: { id: professionalId },
      data: { photoUrl: newPhotoUrl },
    });

    return newPhotoUrl;
  } catch (error) {
    handleError(error);
  }
};

export default {
  postProfessional,
  getProfessionalById,
  getProfessionalByUserId,
  patchProfessional,
  getProfessionals,
  deleteProfessional,
  getProfessionalServiceByIdProfessionalIdService,
  getProfessionalServiceByIdProfessional,
  postProfessionalService,
  deleteProfessionalService,
  getProfessionalServiceById,
  uploadProfessionalImage,
};
