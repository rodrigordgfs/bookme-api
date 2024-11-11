import { z } from "zod";

const patchProfessionalSchemaBody = z.object({
    specialty: z.string().min(2, "Especialidade deve ter pelo menos 2 caracteres"),
    photo: z
    .string()
    .optional()
    .refine(
      (photo) => {
        const urlPattern =
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        const base64Pattern = /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/;
        return urlPattern.test(photo) || base64Pattern.test(photo);
      },
      {
        message:
          "A foto deve ser uma URL ou uma string base64 válida no formato JPG ou PNG",
      }
    ),
});

export { patchProfessionalSchemaBody };
