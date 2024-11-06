import { z } from "zod";

const postAppointmentSchemaBody = z.object({
    professionalServiceId: z.string().uuid({
        message: "ID deve ser um UUID",
    }),
    clientId: z.string().uuid({
        message: "ID deve ser um UUID",
    }),
    dateTime: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Data inválida",
    }),
    observation: z.string().optional(),
});

export { postAppointmentSchemaBody };
