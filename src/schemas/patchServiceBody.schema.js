import { z } from "zod";

const patchServiceSchemaBody = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    description: z.string().min(2, "Descrição deve ter pelo menos 2 caracteres"),
    duration: z.number().int().positive("Duração deve ser um número positivo"),
    price: z.number().int().positive("Preço deve ser um número positivo"),
});

export { patchServiceSchemaBody };
