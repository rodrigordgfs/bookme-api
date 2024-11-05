import { z } from "zod";

const postProfessionalServiceSchemaParams = z.object({
    id_professional: z.string().uuid("Id do usuário deve ser um UUID"),
    id_service: z.string().uuid("Id do serviço deve ser um UUID"),
});

export { postProfessionalServiceSchemaParams };
