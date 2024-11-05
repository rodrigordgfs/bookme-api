import { z } from "zod";

const patchProfessionalSchemaBody = z.object({
    specialty: z.string().min(2, "Especialidade deve ter pelo menos 2 caracteres"),
    hiringDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Data de nascimento inválida",
    })
});

export { patchProfessionalSchemaBody };
