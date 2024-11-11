import { prisma } from "../libs/prisma.js";
import { supabase } from "../libs/supabase.js";

const postProfessional = async (user_id, specialty, photoUrl) => {
  try {
    const professional = await prisma.professional.create({
      data: {
        user: {
          connect: { id: user_id },
        },
        specialty,
        photoUrl
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          },
        },
        photoUrl: true,
        specialty: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return professional;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getProfessionalById = async (id) => {
  try {
    const professional = await prisma.professional.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          },
        },
        photoUrl: true,
        specialty: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return professional;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getProfessionals = async (service) => {
  console.log(service);
  
  try {
    const professionals = await prisma.professional.findMany({
      select: {
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
                  duration: true
                },
              },
            },
          },
        }),
      },
    });
    return professionals;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const getProfessionalByUserId = async (id) => {
  try {
    const professional = await prisma.professional.findUnique({
      where: {
        userId: id,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          },
        },
        photoUrl: true,
        specialty: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return professional;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const patchProfessional = async (id, specialty, photoUrl) => {
  try {
    const professional = await prisma.professional.update({
      where: {
        id,
      },
      data: {
        specialty,
        photoUrl
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          },
        },
        photoUrl: true,
        specialty: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return professional;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteProfessional = async (id) => {
  try {
    const professional = await prisma.professional.delete({
      where: {
        id,
      },
    });
    return professional;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getProfessionalServiceByIdProfessionalIdService = async (
  id_professional,
  id_service
) => {
  try {
    const professionalService = await prisma.professionalService.findUnique({
      where: {
        professionalId_serviceId: {
          professionalId: id_professional,
          serviceId: id_service,
        },
      },
      select: {
        id: true,
        professional: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              },
            },
            specialty: true,
          },
        },
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
    return professionalService;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getProfessionalServiceById = async (id) => {
  try {
    const professionalService = await prisma.professionalService.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        professional: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              },
            },
            specialty: true,
          },
        },
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
    return professionalService;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const getProfessionalServiceByIdProfessional = async (id_professional) => {
  try {
    const professionalService = await prisma.professionalService.findMany({
      where: {
        professionalId: id_professional,
      },
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
    return professionalService;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const postProfessionalService = async (id_professional, id_service) => {
  try {
    const professionalService = await prisma.professionalService.create({
      data: {
        professional: {
          connect: { id: id_professional },
        },
        service: {
          connect: { id: id_service },
        },
      },
      select: {
        id: true,
        professional: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              },
            },
            specialty: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    return professionalService;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteProfessionalService = async (id_professional, id_service) => {
  try {
    const professionalService = await prisma.professionalService.delete({
      where: {
        professionalId_serviceId: {
          professionalId: id_professional,
          serviceId: id_service,
        },
      },
    });
    return professionalService;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const uploadProfissionalImage = async (id_profissional, photoBase64) => {
  try {
    const match = photoBase64.match(/^data:image\/(\w+);base64,/);
    const extension = match ? match[1] : "jpeg";

    const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `profissional/${id_profissional}.${extension}`;

    const { data: existingFile, error: getError } = await supabase.storage
      .from("professionals")
      .list("professional", { search: `${id_profissional}.${extension}` });

    if (getError) {
      console.error("Erro ao buscar arquivo existente:", getError);
      throw getError;
    }

    if (existingFile && existingFile.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from("professionals")
        .remove([fileName]);

      if (deleteError) {
        console.error("Erro ao excluir arquivo existente:", deleteError);
        throw deleteError;
      }
    }

    const { data, error } = await supabase.storage
      .from("profissionals")
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
      .from("profissionals")
      .getPublicUrl(fileName);

    await prisma.professional.update({
      where: {
        id: id_profissional,
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
  uploadProfissionalImage
};
