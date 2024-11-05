import { z } from "zod";

const loginSchemaBody = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

export { loginSchemaBody };
