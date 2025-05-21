import { cpf } from "cpf-cnpj-validator";
import { validatePrescription } from "../validation";

describe("validatePrescription", () => {
  it("valida corretamente uma prescrição válida", async () => {
    const cpf_paciente = cpf.generate();

    const result = await validatePrescription({
      id_prescricao: "1",
      cpf_paciente,
      nome_paciente: "João Silva",
      medicamento: "Paracetamol",
      codigo_medicamento: "ABC123",
      quantidade: 2,
      data_prescricao: "2024-05-01",
    });

    expect(result.success).toBe(true);
  });

  it("retorna erro para CPF inválido", async () => {
    const result = await validatePrescription({
      id_prescricao: "1",
      cpf_paciente: "00000000000",
      nome_paciente: "João Silva",
      medicamento: "Paracetamol",
      codigo_medicamento: "ABC123",
      quantidade: 2,
      data_prescricao: "2024-05-01",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
