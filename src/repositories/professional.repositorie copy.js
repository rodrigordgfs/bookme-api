import { prisma } from "../libs/prisma.js";

const postProfessional = async (user_id, specialty, hiringDate) => {
  try {
    const professional = await prisma.professional.create({
      data: {
        user: {
          connect: { id: user_id },
        },
        specialty,
        hiringDate,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            birthDate: true,
          },
        },
        specialty: true,
        hiringDate: true,
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
            email: true,
            phone: true,
            birthDate: true,
          },
        },
        specialty: true,
        hiringDate: true,
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

const getProfessionals = async () => {
  try {
    const professionals = await prisma.professional.findMany({
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            birthDate: true,
          },
        },
        specialty: true,
        hiringDate: true,
        createdAt: true,
        updatedAt: true,
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
            email: true,
            phone: true,
            birthDate: true,
          },
        },
        specialty: true,
        hiringDate: true,
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

const patchProfessional = async (id, specialty, hiringDate) => {
  try {
    const professional = await prisma.professional.update({
      where: {
        id,
      },
      data: {
        specialty,
        hiringDate,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            birthDate: true,
          },
        },
        specialty: true,
        hiringDate: true,
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
                email: true,
                phone: true,
                birthDate: true,
              },
            },
            specialty: true,
            hiringDate: true,
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
        professional: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                birthDate: true,
              },
            },
            specialty: true,
            hiringDate: true,
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
};
