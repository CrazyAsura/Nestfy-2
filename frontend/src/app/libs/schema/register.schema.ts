import { z } from 'zod';

export const registerSchema = z.object({
  // Informações Pessoais
  name: z.string()
    .min(4, "O nome deve conter pelo menos 4 caracteres")
    .max(100, "O nome é muito longo"),
  email: z.string()
    .email("Insira um endereço de e-mail válido"),
  userType: z.enum(['INDIVIDUAL', 'LEGAL_ENTITY'], {
    message: "Selecione o tipo de usuário",
  }),
  document: z.string()
    .min(11, "Documento inválido")
    .max(18, "Documento muito longo"),
  
  // Segurança
  password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
  confirmPassword: z.string()
    .min(1, "A confirmação de senha é obrigatória"),

  // Contato
  ddi: z.string().min(1, "DDI é obrigatório"),
  ddd: z.string().min(2, "DDD deve ter 2 dígitos"),
  numberPhone: z.string()
    .min(8, "O número de telefone é muito curto")
    .max(15, "O número de telefone é muito longo"),

  // Endereço
  zipCode: z.string().min(8, "CEP inválido"),
  number: z.string().min(1, "O número da residência é obrigatório"),
  street: z.string().min(1, "A rua é obrigatória"),
  neighborhood: z.string().min(1, "O bairro é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  state: z.string().min(1, "O estado é obrigatório"),
  country: z.string().min(1, "O país é obrigatório"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ['confirmPassword'],
}).refine((data) => {
  const doc = data.document.replace(/\D/g, "");
  if (data.userType === 'INDIVIDUAL') return doc.length === 11;
  if (data.userType === 'LEGAL_ENTITY') return doc.length === 14;
  return true;
}, {
  message: "Documento inválido para o tipo de usuário selecionado",
  path: ['document'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;