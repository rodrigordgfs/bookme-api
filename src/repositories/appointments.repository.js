import { prisma } from "../libs/prisma.js";

const postAppointment = async (
  professionalServiceId,
  clientId,
  dateTime,
  observation
) => {
  console.log(professionalServiceId, clientId, dateTime, observation);

  try {
    const appointment = await prisma.appointment.create({
      data: {
        client: {
          connect: {
            id: clientId,
          },
        },
        professionalService: {
          connect: {
            id: professionalServiceId,
          },
        },
        status: "pending",
        dateTime,
        observation,
      },
      select: {
        id: true,
        client: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        professionalService: {
          select: {
            id: true,
            professional: {
              select: {
                id: true,
                specialty: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                duration: true,
                price: true,
              },
            },
          },
        },
        dateTime: true,
        observation: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return appointment;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const patchAppointment = async (
  id,
  professionalServiceId,
  dateTime,
  status,
  observation
) => {
  try {
    const appointment = await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        professionalService: {
          connect: {
            id: professionalServiceId,
          },
        },
        status: status,
        dateTime,
        observation,
      },
      select: {
        id: true,
        client: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        professionalService: {
          select: {
            id: true,
            professional: {
              select: {
                id: true,
                specialty: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                duration: true,
                price: true,
              },
            },
          },
        },
        dateTime: true,
        observation: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return appointment;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAppointments = async (start_date, end_date, status) => {
  try {
    const where = {};
    if (start_date) {
      where.dateTime = { ...where.dateTime, gte: new Date(start_date) };
    }
    if (end_date) {
      where.dateTime = { ...where.dateTime, lte: new Date(end_date) };
    }
    if (status) {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      select: {
        id: true,
        client: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        professionalService: {
          select: {
            id: true,
            professional: {
              select: {
                id: true,
                specialty: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                duration: true,
                price: true,
              },
            },
          },
        },
        status: true,
        dateTime: true,
        observation: true,
        createdAt: true,
        updatedAt: true,
      },
      where: Object.keys(where).length > 0 ? where : undefined,
    });

    return appointments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const getAppointmentById = async (id) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        client: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        professionalService: {
          select: {
            id: true,
            professional: {
              select: {
                id: true,
                specialty: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                description: true,
                duration: true,
                price: true,
              },
            },
          },
        },
        status: true,
        dateTime: true,
        observation: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return appointment;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteAppointment = async (id) => {
  try {
    const appointment = await prisma.appointment.delete({
      where: {
        id,
      },
    });
    return appointment;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  postAppointment,
  patchAppointment,
  getAppointments,
  getAppointmentById,
  deleteAppointment,
};
