import appointmentRepositorie from "../repositories/appointments.repository.js";
import professionalRepositorie from "../repositories/professional.repositorie.js";
import clientRepositorie from "../repositories/client.repository.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error.js";

const verifyResourceExistence = async (resourceExists, errorMessage) => {
  if (!resourceExists) {
    throw new AppError(errorMessage, StatusCodes.NOT_FOUND);
  }
};

const formatDate = (dateTime) => new Date(dateTime);

const postAppointment = async (
  professionalServiceId,
  clientId,
  dateTime,
  observation
) => {
  const [clientExists, professionalServiceExists] = await Promise.all([
    clientRepositorie.getClientById(clientId),
    professionalRepositorie.getProfessionalServiceById(professionalServiceId),
  ]);

  await verifyResourceExistence(clientExists, "Client not found");
  await verifyResourceExistence(
    professionalServiceExists,
    "Professional service not found"
  );

  const dateTimeISO = formatDate(dateTime);

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
  const [appointmentExists, professionalServiceExists] = await Promise.all([
    appointmentRepositorie.getAppointmentById(id),
    professionalRepositorie.getProfessionalServiceById(professionalServiceId),
  ]);

  await verifyResourceExistence(appointmentExists, "Appointment not found");
  await verifyResourceExistence(
    professionalServiceExists,
    "Professional service not found"
  );

  const dateTimeISO = formatDate(dateTime);

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
  await verifyResourceExistence(appointmentExists, "Appointment not found");

  await appointmentRepositorie.deleteAppointment(id);
};

export default {
  postAppointment,
  patchAppointment,
  getAppointments,
  getAppointmentById,
  deleteAppointment,
};
