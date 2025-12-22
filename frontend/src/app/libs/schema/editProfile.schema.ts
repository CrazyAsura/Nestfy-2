import { z } from 'zod';

export const editProfileSchema = z.object({
  // Informações Pessoais
  name: z.string()
    .trim()
    .min(3, "O nome deve conter pelo menos 3 caracteres para ser válido")
    .max(100, "O nome excedeu o limite máximo de 100 caracteres"),
  
  email: z.string()
    .trim()
    .toLowerCase()
    .email("Por favor, insira um endereço de e-mail válido (ex: seu-nome@exemplo.com)"),
  
  userType: z.enum(['INDIVIDUAL', 'LEGAL_ENTITY'], {
     message: "Selecione se você é Pessoa Física ou Jurídica",
   }),
  
  document: z.string().min(1, "O documento de identificação (CPF ou CNPJ) é obrigatório"),
  
  // Contato
  ddi: z.string().min(1, "O código do país (DDI) é necessário para o contato"),
  
  ddd: z.string()
    .length(2, "O DDD deve ter exatamente 2 dígitos numéricos"),
  
  numberPhone: z.string()
    .trim()
    .min(8, "O telefone deve ter no mínimo 8 dígitos")
    .max(15, "O telefone parece ser muito longo, verifique o número"),

  // Endereço
  zipCode: z.string()
    .trim()
    .refine((val) => val.replace(/\D/g, '').length === 8, "O CEP deve conter exatamente 8 dígitos (apenas números)"),
    
  number: z.string()
    .trim()
    .min(1, "O número do endereço é obrigatório. Caso não possua, use 'S/N'")
    .max(10, "O número do endereço está muito longo"),
    
  street: z.string()
    .trim()
    .min(3, "O nome da rua/logradouro deve ser preenchido corretamente"),
    
  neighborhood: z.string()
    .trim()
    .min(2, "O nome do bairro é necessário para a localização"),
    
  city: z.string()
    .trim()
    .min(2, "O nome da cidade é obrigatório"),
    
  state: z.string()
    .trim()
    .min(2, "O estado (UF) é obrigatório"),
    
  country: z.string()
    .trim()
    .min(2, "O país de residência é obrigatório"),
    
  image: z.any().optional(),
}).refine((data) => {
  const digits = data.document.replace(/\D/g, '');
  if (data.userType === 'INDIVIDUAL') {
    return digits.length === 11;
  }
  return digits.length === 14;
}, {
  message: "O número do documento não corresponde ao tipo de conta selecionado (CPF exige 11 dígitos, CNPJ exige 14)",
  path: ["document"],
});

export type EditProfileFormData = z.input<typeof editProfileSchema>;
export type EditProfileOutput = z.infer<typeof editProfileSchema>;
