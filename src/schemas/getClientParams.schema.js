import { z } from "zod";

const getClientSchemaParams = z.object({
    id: z.string().uuid("ID de usuário inválido"),
});

export { getClientSchemaParams };
