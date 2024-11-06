import { z } from "zod";

const patchSchemaBody = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres")
});

export { patchSchemaBody };
