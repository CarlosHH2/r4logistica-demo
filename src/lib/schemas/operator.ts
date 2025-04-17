
import { z } from 'zod';

export const operatorFormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  lastname: z.string().min(2, { message: 'El apellido paterno debe tener al menos 2 caracteres' }),
  secondLastname: z.string().min(2, { message: 'El apellido materno debe tener al menos 2 caracteres' }),
  sex: z.enum(['masculino', 'femenino', 'otro'], { 
    required_error: 'Por favor selecciona una opción' 
  }),
  birthDate: z.date({
    required_error: 'La fecha de nacimiento es requerida',
  }),
  curp: z.string().min(18, { message: 'El CURP debe tener 18 caracteres' }).max(18),
  rfc: z.string().min(10, { message: 'El RFC debe tener entre 10 y 13 caracteres' }).max(13),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'El teléfono debe tener al menos 10 dígitos' }),
  offerSource: z.string().min(1, { message: 'Por favor indica cómo se enteró de la oferta' }),
  activeTab: z.enum(['personal', 'documents', 'vehicles']).default('personal'),
});

export type OperatorFormValues = z.infer<typeof operatorFormSchema>;
