import { DocumentType } from '@prisma/client';
import { z } from 'zod';

export const listTemplatesQuerySchema = z.object({
  type: z.nativeEnum(DocumentType).optional(),
  active: z
    .string()
    .transform((value) => value === 'true')
    .optional(),
});

export const createTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.nativeEnum(DocumentType),
  version: z.string().min(1).default('v1'),
  storageKey: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const updateTemplateSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    version: z.string().min(1).optional(),
    storageKey: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const templateIdParamsSchema = z.object({
  templateId: z.string().min(1),
});

export type ListTemplateQueryInput = z.infer<typeof listTemplatesQuerySchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;

