import { z } from "zod";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

export const prescriptionSchema = z
  .object({
    id_prescricao: z.string().nonempty("ID obrigatório"),

    cpf_paciente: z
      .string()
      .length(11, "CPF deve ter 11 dígitos")
      .refine((cpf) => cpfValidator.isValid(cpf), {
        message: "CPF inválido",
      }),

    nome_paciente: z.string().min(1, "Nome obrigatório"),

    medicamento: z.string(),

    codigo_medicamento: z
      .string()
      .regex(/^[A-Z0-9]{6}$/, "Código deve conter 6 caracteres alfanuméricos"),

    quantidade: z.coerce
      .number()
      .positive("Quantidade deve ser maior que zero")
      .max(10, "Quantidade máxima permitida é 10"),

    data_prescricao: z.string().refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, "Data inválida ou no futuro"),
  })
  .superRefine((data, ctx) => {
    if (data.medicamento === "Dipirona" && data.quantidade > 5) {
      ctx.addIssue({
        path: ["quantidade"],
        code: z.ZodIssueCode.custom,
        message: "Dipirona não pode ser prescrita em quantidade maior que 5",
      });
    }
  });

export function validatePrescription(data: any) {
  return prescriptionSchema.safeParse(data);
}
