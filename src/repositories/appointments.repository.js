import { prisma } from "../libs/prisma.js";

const appointmentSelectFields = {
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
};

const postAppointment = async (
  professionalServiceId,
  clientId,
  dateTime,
  observation
) => {
  try {
    return await prisma.appointment.create({
      data: {
        client: { connect: { id: clientId } },
        professionalService: { connect: { id: professionalServiceId } },
        status: "pending",
        dateTime,
        observation,
      },
      select: appointmentSelectFields,
    });
  } catch (error) {
    console.error("Erro ao criar o agendamento:", error);
    throw new Error("Erro ao criar o agendamento");
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
    return await prisma.appointment.update({
      where: { id },
      data: {
        professionalService: { connect: { id: professionalServiceId } },
        status,
        dateTime,
        observation,
      },
      select: appointmentSelectFields,
    });
  } catch (error) {
    console.error("Erro ao atualizar o agendamento:", error);
    throw new Error("Erro ao atualizar o agendamento");
  }
};

const getAppointments = async (start_date, end_date, status) => {
  const where = {};
  if (start_date)
    where.dateTime = { ...where.dateTime, gte: new Date(start_date) };
  if (end_date) where.dateTime = { ...where.dateTime, lte: new Date(end_date) };
  if (status) where.status = status;

  try {
    return await prisma.appointment.findMany({
      select: appointmentSelectFields,
      where: Object.keys(where).length > 0 ? where : undefined
    });
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    throw new Error("Erro ao listar agendamentos");
  }
};

const getAppointmentById = async (id) => {
  try {
    return await prisma.appointment.findUnique({
      where: { id },
      select: appointmentSelectFields,
    });
  } catch (error) {
    console.error("Erro ao buscar o agendamento:", error);
    throw new Error("Erro ao buscar o agendamento");
  }
};

const deleteAppointment = async (id) => {
  try {
    return await prisma.appointment.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Erro ao deletar o agendamento:", error);
    throw new Error("Erro ao deletar o agendamento");
  }
};

export default {
  postAppointment,
  patchAppointment,
  getAppointments,
  getAppointmentById,
  deleteAppointment,
};
