import { z } from "zod";

const patchServiceSchemaParams = z.object({
    id: z.string().uuid("ID deve ser um UUID"),
});

export { patchServiceSchemaParams };
