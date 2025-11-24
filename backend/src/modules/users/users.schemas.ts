import { UserStatus } from '@prisma/client';
import { z } from 'zod';

const roleEnum = z.enum(['VictorAdmin', 'OperatorAdmin', 'Handler', 'AuthorityUser']);

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  role: roleEnum,
  status: z.nativeEnum(UserStatus).optional(),
});

export const updateUserSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(10).optional(),
    role: roleEnum.optional(),
    status: z.nativeEnum(UserStatus).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const userIdParamsSchema = z.object({
  userId: z.string().min(1),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

