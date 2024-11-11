import { z } from "zod";

const postProfessionalSchemaBody = z.object({
    id_user: z.string().uuid("ID de usuário inválido"),
    specialty: z.string().min(2, "Especialidade deve ter pelo menos 2 caracteres"),
    photo: z.string()
        .regex(/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/, "Formato de imagem inválido")
        .optional()
});

export { postProfessionalSchemaBody };
