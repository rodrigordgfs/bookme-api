import { z } from "zod";

const deleteClientSchemaParams = z.object({
    id: z.string().uuid("ID de usuário inválido"),
});

export { deleteClientSchemaParams };
