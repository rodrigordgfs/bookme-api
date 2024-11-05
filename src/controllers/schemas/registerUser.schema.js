import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
    birthDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Data de nascimento inválida",
    })
});

export { registerSchema };
