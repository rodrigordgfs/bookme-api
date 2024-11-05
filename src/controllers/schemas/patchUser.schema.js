import { z } from "zod";

const patchSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
    birthDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Data de nascimento inválida",
    })
});

export { patchSchema };
