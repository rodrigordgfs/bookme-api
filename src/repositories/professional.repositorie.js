import { prisma } from "../libs/prisma.js";

const baseProfessionalSelect = {
  id: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  photo: true,
  specialty: true,
  createdAt: true,
  updatedAt: true,
};

const handleError = (error) => {
  console.error(error);
  throw error;
};

const postProfessional = async (user_id, specialty, photo) => {
  try {
    return await prisma.professional.create({
      data: {
        user: {
          connect: { id: user_id },
        },
        specialty,
        photo,
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

const getProfessionals = async (
  service,
  name,
  email,
  specialty,
  page = 1,
  perPage = 10
) => {
  try {
    const conditions = [
      name
        ? { user: { name: { contains: name, mode: "insensitive" } } }
        : undefined,
      email ? { email: { contains: email, mode: "insensitive" } } : undefined,
      specialty
        ? { specialty: { contains: specialty, mode: "insensitive" } }
        : undefined,
    ].filter(Boolean);

    const skip = (Math.max(page, 1) - 1) * Math.max(perPage, 1);

    const totalItems = await prisma.professional.count({
      where: conditions.length > 0 ? { OR: conditions } : undefined,
    });

    const totalPages = Math.ceil(totalItems / perPage);

    const profissionals = await prisma.professional.findMany({
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
      skip,
      take: perPage,
      cacheStrategy: { ttl: 60 }
    });

    return {
      profissionals,
      totalPages,
      currentPage: page,
      totalItems,
    };
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

const patchProfessional = async (id, specialty, photo) => {
  try {
    return await prisma.professional.update({
      where: { id },
      data: { specialty, photo },
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
      cacheStrategy: { ttl: 60 }
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
  getProfessionalServiceById
};
