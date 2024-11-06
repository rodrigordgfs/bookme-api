import { z } from "zod";

const deleteAppointmentSchemaParams = z.object({
    id_appointment: z.string().uuid("Id do appointment deve ser um UUID")
});

export { deleteAppointmentSchemaParams };
