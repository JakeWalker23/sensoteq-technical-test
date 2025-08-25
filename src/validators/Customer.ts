import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  store_id: z.number().int().positive(),
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.string().email(),
  phone: z.string().trim().min(1),         // <-- REQUIRED now
  address: z.string().trim().min(1),
  address2: z.string().trim().optional().default(''),
  district: z.string().trim().min(1),
  city_id: z.number().int().positive(),
  postal_code: z.string().trim().optional(),
});

export type CreateCustomerPayload = z.infer<typeof CreateCustomerSchema>;