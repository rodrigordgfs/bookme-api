import appointmentsService from "../services/appointments.service.js";
import {
  postAppointmentSchemaBody,
  patchAppointmentSchemaBody,
  patchAppointmentSchemaParams,
  getAppointmentSchemaParams,
  deleteAppointmentSchemaParams,
} from "../schemas/index.js";
import appointmentsRepository from "../repositories/appointments.repository.js";

const postAppointment = async (request, reply) => {
  try {
    const { professionalServiceId, clientId, dateTime, observation } =
      postAppointmentSchemaBody.parse(request.body);

    const appointment = await appointmentsService.postAppointment(
      professionalServiceId,
      clientId,
      dateTime,
      observation
    );

    reply.status(201).send(appointment);
  } catch (error) {
    console.log(error);

    if (error.message === "Professional service not found") {
      return reply.code(404).send({
        error: "Serviço profissional não encontrado",
      });
    } else if (error.message === "Client not found") {
      return reply.code(404).send({
        error: "Cliente não encontrado",
      });
    }

    reply.code(500).send({
      error: "Ocorreu um erro ao cadastrar o agendamento",
    });
  }
};

const patchAppointment = async (request, reply) => {
  try {
    const { id_appointment } = patchAppointmentSchemaParams.parse(
      request.params
    );
    const { professionalServiceId, dateTime, observation } =
      patchAppointmentSchemaBody.parse(request.body);

    const appointment = await appointmentsService.patchAppointment(
      id_appointment,
      professionalServiceId,
      dateTime,
      observation
    );

    reply.send(appointment);
  } catch (error) {
    console.log(error);
    if (error.message === "Appointment not found") {
      return reply.code(404).send({
        error: "Agendamento não encontrado",
      });
    } else if (error.message === "Professional service not found") {
      return reply.code(404).send({
        error: "Serviço profissional não encontrado",
      });
    }

    reply.code(500).send({
      error: "Ocorreu um erro ao atualizar o agendamento",
    });
  }
};

const getAppointments = async (request, reply) => {
  try {
    const appointments = await appointmentsService.getAppointments();

    reply.send(appointments);
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      error: "Ocorreu um erro ao buscar os agendamentos",
    });
  }
};

const getAppointmentById = async (request, reply) => {
  try {
    const { id_appointment } = getAppointmentSchemaParams.parse(request.params);

    const appointment = await appointmentsService.getAppointmentById(
      id_appointment
    );

    reply.send(appointment);
  } catch (error) {
    console.log(error);
    if (error.message === "Appointment not found") {
      return reply.code(404).send({
        error: "Agendamento não encontrado",
      });
    }

    reply.code(500).send({
      error: "Ocorreu um erro ao buscar o agendamento",
    });
  }
};

const deleteAppointment = async (request, reply) => {
  try {
    const { id_appointment } = deleteAppointmentSchemaParams.parse(
      request.params
    );

    await appointmentsRepository.getAppointmentById(id_appointment);

    await appointmentsService.deleteAppointment(id_appointment);

    reply.code(204).send();
  } catch (error) {
    console.log(error);
    if (error.message === "Appointment not found") {
      return reply.code(404).send({
        error: "Agendamento não encontrado",
      });
    }

    reply.code(500).send({
      error: "Ocorreu um erro ao deletar o agendamento",
    });
  }
};

export default {
  postAppointment,
  patchAppointment,
  getAppointments,
  getAppointmentById,
  deleteAppointment,
};
