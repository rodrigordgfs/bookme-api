import { z } from "zod";

const deleteServiceSchemaParams = z.object({
    id: z.string().uuid("ID deve ser um UUID"),
});

export { deleteServiceSchemaParams };
