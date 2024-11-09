import { z } from "zod";

const postClientSchemaBody = z.object({
    id_user: z.string().uuid("ID de usuário inválido"),
    phone: z.string().min(10, "Telefone inválido").max(11, "Telefone inválido"),
    birthDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Data de nascimento inválida",
    }),
    gender: z.string().refine(g => g === "M" || g === "F" || g === "O", {
        message: "Gênero inválido",
    }),
    photo: z.string()
        .regex(/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/, "Formato de imagem inválido")
        .optional()
});

export { postClientSchemaBody };
