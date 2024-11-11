import appointmentRepositorie from "../repositories/appointments.repository.js";
import professionalRepositorie from "../repositories/professional.repositorie.js";
import clientRepositorie from "../repositories/client.repository.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error.js";

const postAppointment = async (
  professionalServiceId,
  clientId,
  dateTime,
  observation
) => {
  const clientExists = await clientRepositorie.getClientById(clientId);
  if (!clientExists) {
    throw new AppError("Client not found", StatusCodes.NOT_FOUND);
  }

  const professionalServiceExists =
    await professionalRepositorie.getProfessionalServiceById(
      professionalServiceId
    );
  if (!professionalServiceExists) {
    throw new AppError("Professional service not found", StatusCodes.NOT_FOUND);
  }

  const dateTimeISO = new Date(dateTime);

  const appointment = await appointmentRepositorie.postAppointment(
    professionalServiceId,
    clientId,
    dateTimeISO,
    observation
  );

  return appointment;
};

const patchAppointment = async (
  id,
  professionalServiceId,
  dateTime,
  status,
  observation
) => {
  const appointmentExists = await appointmentRepositorie.getAppointmentById(id);
  if (!appointmentExists) {
    throw new AppError("Appointment not found", StatusCodes.NOT_FOUND);
  }

  const professionalServiceExists = await professionalRepositorie.getProfessionalServiceById(
    professionalServiceId
  );
  if (!professionalServiceExists) {
    throw new AppError("Professional service not found", StatusCodes.NOT_FOUND);
  }

  const dateTimeISO = new Date(dateTime);

  const appointment = await appointmentRepositorie.patchAppointment(
    id,
    professionalServiceId,
    dateTimeISO,
    observation,
    status
  );

  return appointment;
};

const getAppointments = async () => {
  const appointments = await appointmentRepositorie.getAppointments();

  return appointments;
};

const getAppointmentById = async (id) => {
  const appointment = await appointmentRepositorie.getAppointmentById(id);

  return appointment;
};

const deleteAppointment = async (id) => {
  const appointmentExists = await appointmentRepositorie.getAppointmentById(id);
  if (!appointmentExists) {
    throw new AppError("Appointment not found", StatusCodes.NOT_FOUND);
  }

  await appointmentRepositorie.deleteAppointment(id);

  return;
};

export default {
  postAppointment,
  patchAppointment,
  getAppointments,
  getAppointmentById,
  deleteAppointment,
};
