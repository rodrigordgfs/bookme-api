import appointmentRepositorie from "../repositories/appointments.repository.js";
import {
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO,
  subMonths,
  subDays,
} from "date-fns";

const groupAppointmentsByMonth = (appointments) => {
  const groupedByMonth = {};

  appointments.forEach((appointment) => {
    const appointmentDate = new Date(appointment.dateTime);
    const monthKey =
      appointmentDate
        .toLocaleString("pt-BR", { month: "short" })
        .charAt(0)
        .toUpperCase() +
      appointmentDate.toLocaleString("pt-BR", { month: "short" }).slice(1, -1) +
      "/" +
      appointmentDate.getFullYear().toString().slice(-2);

    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = {
        totalAmount: 0,
      };
    }

    groupedByMonth[monthKey].totalAmount +=
      appointment.professionalService.service.price || 0;
  });

  return groupedByMonth;
};

const getTotalMonth = async () => {
  const startOfCurrentMonth = startOfMonth(new Date());
  const endOfCurrentMonth = endOfMonth(new Date());

  const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));
  const endOfLastMonth = endOfMonth(subMonths(new Date(), 1));

  const appointmentsCurrentMonth = await appointmentRepositorie.getAppointments(
    startOfCurrentMonth,
    endOfCurrentMonth
  );
  const totalReceptCurrentMonth = appointmentsCurrentMonth.reduce(
    (total, appointment) => {
      return total + (appointment.professionalService.service.price || 0);
    },
    0
  );

  const appointmentsLastMonth = await appointmentRepositorie.getAppointments(
    startOfLastMonth,
    endOfLastMonth
  );
  const totalReceptLastMonth = appointmentsLastMonth.reduce(
    (total, appointment) => {
      return total + (appointment.professionalService.service.price || 0);
    },
    0
  );

  const percentageChange = totalReceptLastMonth
    ? ((totalReceptCurrentMonth - totalReceptLastMonth) /
        totalReceptLastMonth) *
      100
    : 0;

  return {
    amount: totalReceptCurrentMonth,
    lastMonthAmount: totalReceptLastMonth,
    percentageChange: parseFloat(percentageChange.toFixed(2)),
  };
};

const getAppointmentsMonth = async () => {
  const startOfCurrentMonth = startOfMonth(new Date());
  const endOfCurrentMonth = endOfMonth(new Date());

  const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));
  const endOfLastMonth = endOfMonth(subMonths(new Date(), 1));

  const appointmentsCurrentMonth = await appointmentRepositorie.getAppointments(
    startOfCurrentMonth,
    endOfCurrentMonth
  );

  const appointmentsLastMonth = await appointmentRepositorie.getAppointments(
    startOfLastMonth,
    endOfLastMonth
  );

  const currentMonthAppointments = appointmentsCurrentMonth.length;
  const lastMonthAppointments = appointmentsLastMonth.length;

  const percentageChange = lastMonthAppointments
    ? ((currentMonthAppointments - lastMonthAppointments) /
        lastMonthAppointments) *
      100
    : 0;

  return {
    appointments: currentMonthAppointments,
    lastMonthAppointments,
    percentageChange: parseFloat(percentageChange.toFixed(2)),
  };
};

const getAppointmentsDay = async () => {
  const startOfCurrentDay = new Date();
  const endOfCurrentDay = new Date();

  const startOfLastDay = subDays(new Date(), 1);
  const endOfLastDay = subDays(new Date(), 1);

  const appointmentsCurrentDay = await appointmentRepositorie.getAppointments(
    startOfCurrentDay,
    endOfCurrentDay
  );

  const appointmentsLastDay = await appointmentRepositorie.getAppointments(
    startOfLastDay,
    endOfLastDay
  );

  const currentDayAppointments = appointmentsCurrentDay.length;
  const lastDayAppointments = appointmentsLastDay.length;

  const percentageChange = lastDayAppointments
    ? ((currentDayAppointments - lastDayAppointments) / lastDayAppointments) *
      100
    : 0;

  return {
    appointments: currentDayAppointments,
    lastDayAppointments,
    percentageChange: parseFloat(percentageChange.toFixed(2)),
  };
};

const getAppointmentsInterval = async (start_date, end_date) => {
  const startDateISO = new Date(start_date);
  const endDateISO = new Date(end_date);

  const appointmentsInterval = await appointmentRepositorie.getAppointments(
    startDateISO,
    endDateISO
  );

  const appointmentsByMonth = groupAppointmentsByMonth(appointmentsInterval);

  return appointmentsByMonth;
};

const getServicesInterval = async (start_date, end_date) => {
  const startDateISO = new Date(start_date);
  const endDateISO = new Date(end_date);

  const appointmentsInterval = await appointmentRepositorie.getAppointments(
    startDateISO,
    endDateISO
  );

  const services = {};

  appointmentsInterval.forEach((appointment) => {
    const serviceName = appointment.professionalService.service.name;
    if (serviceName) {
      if (!services[serviceName]) {
        services[serviceName] = 0;
      }
      services[serviceName] += 1;
    }
  });

  return services;
};

const getAppointmentsCanceled = async () => {
  const startOfCurrentMonth = startOfMonth(new Date());
  const endOfCurrentMonth = endOfMonth(new Date());

  const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));
  const endOfLastMonth = endOfMonth(subMonths(new Date(), 1));

  const appointmentsCurrentMonth = await appointmentRepositorie.getAppointments(
    startOfCurrentMonth,
    endOfCurrentMonth,
    "canceled"
  );

  const appointmentsLastMonth = await appointmentRepositorie.getAppointments(
    startOfLastMonth,
    endOfLastMonth,
    "canceled"
  );

  const currentMonthAppointments = appointmentsCurrentMonth.length;
  const lastMonthAppointments = appointmentsLastMonth.length;

  const percentageChange = lastMonthAppointments
    ? ((currentMonthAppointments - lastMonthAppointments) / lastMonthAppointments) * 100
    : 0;

  return {
    appointments: currentMonthAppointments,
    lastMonthAppointments,
    percentageChange: parseFloat(percentageChange.toFixed(2)),
  };
};


export default {
  getTotalMonth,
  getAppointmentsMonth,
  getAppointmentsDay,
  getAppointmentsInterval,
  getServicesInterval,
  getAppointmentsCanceled,
};
