import { z } from "zod";

const patchAppointmentSchemaBody = z.object({
  professionalServiceId: z.string().uuid({
    message: "ID deve ser um UUID",
  }),
  dateTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data inválida",
  }),
  status: z.enum(["pending", "confirmed", "completed", "canceled"], {
    message: "Status inválido",
  }),
  observation: z.string().optional(),
});

export { patchAppointmentSchemaBody };
