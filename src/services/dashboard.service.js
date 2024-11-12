import appointmentRepositorie from "../repositories/appointments.repository.js";
import { startOfMonth, endOfMonth, subMonths, subDays } from "date-fns";

const getAppointmentsForPeriod = async (startDate, endDate, status = null) => {
  return await appointmentRepositorie.getAppointments(
    startDate,
    endDate,
    status
  );
};

const calculateTotalAmount = (appointments) => {
  return appointments.reduce((total, appointment) => {
    return total + (appointment.professionalService.service.price || 0);
  }, 0);
};

const calculatePercentageChange = (current, previous) => {
  return previous ? ((current - previous) / previous) * 100 : 0;
};

const groupAppointmentsByMonth = (appointments) => {
  return appointments.reduce((groupedByMonth, appointment) => {
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
      groupedByMonth[monthKey] = { totalAmount: 0 };
    }

    groupedByMonth[monthKey].totalAmount +=
      appointment.professionalService.service.price || 0;
    return groupedByMonth;
  }, {});
};

const getTotalMonth = async () => {
  const startOfCurrentMonth = startOfMonth(new Date());
  const endOfCurrentMonth = endOfMonth(new Date());
  const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));
  const endOfLastMonth = endOfMonth(subMonths(new Date(), 1));

  const [appointmentsCurrentMonth, appointmentsLastMonth] = await Promise.all([
    getAppointmentsForPeriod(startOfCurrentMonth, endOfCurrentMonth),
    getAppointmentsForPeriod(startOfLastMonth, endOfLastMonth),
  ]);

  const totalReceptCurrentMonth = calculateTotalAmount(
    appointmentsCurrentMonth
  );
  const totalReceptLastMonth = calculateTotalAmount(appointmentsLastMonth);

  const percentageChange = calculatePercentageChange(
    totalReceptCurrentMonth,
    totalReceptLastMonth
  );

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

  const [appointmentsCurrentMonth, appointmentsLastMonth] = await Promise.all([
    getAppointmentsForPeriod(startOfCurrentMonth, endOfCurrentMonth),
    getAppointmentsForPeriod(startOfLastMonth, endOfLastMonth),
  ]);

  const currentMonthAppointments = appointmentsCurrentMonth.length;
  const lastMonthAppointments = appointmentsLastMonth.length;

  const percentageChange = calculatePercentageChange(
    currentMonthAppointments,
    lastMonthAppointments
  );

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

  const [appointmentsCurrentDay, appointmentsLastDay] = await Promise.all([
    getAppointmentsForPeriod(startOfCurrentDay, endOfCurrentDay),
    getAppointmentsForPeriod(startOfLastDay, endOfLastDay),
  ]);

  const currentDayAppointments = appointmentsCurrentDay.length;
  const lastDayAppointments = appointmentsLastDay.length;

  const percentageChange = calculatePercentageChange(
    currentDayAppointments,
    lastDayAppointments
  );

  return {
    appointments: currentDayAppointments,
    lastDayAppointments,
    percentageChange: parseFloat(percentageChange.toFixed(2)),
  };
};

const getAppointmentsInterval = async (start_date, end_date) => {
  const startDateISO = new Date(start_date);
  const endDateISO = new Date(end_date);

  const appointmentsInterval = await getAppointmentsForPeriod(
    startDateISO,
    endDateISO
  );

  return groupAppointmentsByMonth(appointmentsInterval);
};

const getServicesInterval = async (start_date, end_date) => {
  const startDateISO = new Date(start_date);
  const endDateISO = new Date(end_date);

  const appointmentsInterval = await getAppointmentsForPeriod(
    startDateISO,
    endDateISO
  );

  return appointmentsInterval.reduce((services, appointment) => {
    const serviceName = appointment.professionalService.service.name;
    if (serviceName) {
      services[serviceName] = (services[serviceName] || 0) + 1;
    }
    return services;
  }, {});
};

const getAppointmentsCanceled = async () => {
  const startOfCurrentMonth = startOfMonth(new Date());
  const endOfCurrentMonth = endOfMonth(new Date());
  const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));
  const endOfLastMonth = endOfMonth(subMonths(new Date(), 1));

  const [appointmentsCurrentMonth, appointmentsLastMonth] = await Promise.all([
    getAppointmentsForPeriod(
      startOfCurrentMonth,
      endOfCurrentMonth,
      "canceled"
    ),
    getAppointmentsForPeriod(startOfLastMonth, endOfLastMonth, "canceled"),
  ]);

  const currentMonthAppointments = appointmentsCurrentMonth.length;
  const lastMonthAppointments = appointmentsLastMonth.length;

  const percentageChange = calculatePercentageChange(
    currentMonthAppointments,
    lastMonthAppointments
  );

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
