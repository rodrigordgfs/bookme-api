import { z } from "zod";

const getProfessionalSchemaParams = z.object({
    id: z.string().uuid("ID de usuário inválido"),
});

export { getProfessionalSchemaParams };
