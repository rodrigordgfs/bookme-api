import { z } from "zod";

const patchProfessionalSchemaParams = z.object({
    id: z.string().uuid("ID de usuário inválido"),
});

export { patchProfessionalSchemaParams };
