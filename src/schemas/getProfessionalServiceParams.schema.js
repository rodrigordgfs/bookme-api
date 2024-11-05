import { z } from "zod";

const getProfessionalServiceSchemaParams = z.object({
    id_professional: z.string().uuid("ID de usuário inválido"),
});

export { getProfessionalServiceSchemaParams };
