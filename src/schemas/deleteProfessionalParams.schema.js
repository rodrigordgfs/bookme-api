import { z } from "zod";

const deleteProfessionalSchemaParams = z.object({
    id: z.string().uuid("ID de usuário inválido"),
});

export { deleteProfessionalSchemaParams };
