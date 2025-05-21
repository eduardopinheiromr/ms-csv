
# 📦 MS-CSV – Microsserviço de Processamento de Arquivos CSV

Microsserviço desenvolvido em NestJS para upload e validação de arquivos CSV.  
Suporta múltiplos modos de processamento (`batch`, `stream`, `parallel`), autenticação por chave de API e documentação via Swagger.

---

## 🚀 Funcionalidades

- ✅ Upload de arquivos `.csv` via `multipart/form-data`
- ✅ Validação de estrutura e regras de negócio com Zod
- ✅ Suporte a 3 modos de processamento:
  - **Batch** – carrega tudo na memória
  - **Stream** – processa linha a linha com baixo uso de memória
  - **Parallel** – utiliza múltiplos núcleos para paralelizar validações
- ✅ Retorno com estatísticas: total, válidos, inválidos, erros e tempo de execução
- ✅ Swagger com autenticação por `x-api-key`
- ✅ Testes com cobertura usando Jest

---

## ⚙️ Tecnologias Utilizadas

- NestJS
- Zod
- csv-parser
- cpf-cnpj-validator
- worker_threads
- Jest
- Swagger / OpenAPI

---

## 🔐 Autenticação

Todas as rotas exigem o header:

```
x-api-key: sua-chave-aqui
```

Configure via `.env`:

```
API_KEY=suachaveaqui
```

---

## 📤 Upload de Arquivo

### Endpoint

```
POST /upload?mode=batch|stream|parallel
```

### Query Params

| Param | Obrigatório | Descrição                      |
|-------|-------------|--------------------------------|
| mode  | Não         | Modo de processamento (`batch`, `stream`, `parallel`). Padrão: `batch` |

### Headers

```pnpm
x-api-key: sua-chave-aqui
Content-Type: multipart/form-data
```

### Body (form-data)

- `file`: Arquivo CSV com as colunas esperadas

---

## 📘 Documentação Swagger

Acesse:

```
GET /docs
```

E clique em “Authorize” para inserir sua API Key.

---

## 🧪 Exemplo de Resposta

```json
{
  "duration": {
    "milliseconds": 327,
    "seconds": "0.33"
  },
  "total": 500,
  "valid": 489,
  "invalid": 11,
  "errors": [
    {
      "row": { ... },
      "errors": { ... }
    }
  ],
}
```

---

## 🧱 Estrutura do Projeto

```
src/
├── upload/
│   ├── upload.controller.ts
│   ├── upload.service.ts
│   ├── strategies/
│   │   ├── batch.processor.ts
│   │   ├── stream.processor.ts
│   │   └── parallel.processor.ts
│   └── workers/
│       └── csv.worker.ts
├── validators/
│   ├── schema.ts
│   └── validatePrescription.ts
├── common/
│   └── guards/api-key.guard.ts
```

---

## 🧪 Testes

```bash
# Testes unitários
pnpm run test

# Testes com cobertura
pnpm run test:cov
```

---

## 🧑‍💻 Rodando Localmente

```bash
# Instalar dependências
pnpm install

# Rodar em modo dev
pnpm run start:dev
```
