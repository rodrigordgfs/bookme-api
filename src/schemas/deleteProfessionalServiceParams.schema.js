import { z } from "zod";

const deleteProfessionalServiceSchemaParams = z.object({
    id_professional: z.string().uuid("ID de usuário inválido"),
    id_service: z.string().uuid("ID de serviço inválido"),
});

export { deleteProfessionalServiceSchemaParams };
