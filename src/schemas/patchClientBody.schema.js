import { z } from "zod";

const patchClientSchemaBody = z.object({
  phone: z.string().min(10, "Telefone inválido").max(11, "Telefone inválido"),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de nascimento inválida",
  }),
  gender: z.string().refine((g) => g === "M" || g === "F" || g === "O", {
    message: "Gênero inválido",
  }),
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

export { patchClientSchemaBody };
