import { UserStatus } from '@prisma/client';

import { NotFoundError, ValidationError } from '../../core/error';
import { prisma } from '../../lib/prisma';
import { hashPassword } from '../../lib/crypto';
import type { CreateUserInput, UpdateUserInput } from './users.schemas';

const sanitizeUser = (user: {
  id: string;
  email: string;
  status: UserStatus;
  role: { name: string };
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: user.id,
  email: user.email,
  status: user.status,
  role: user.role.name,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const listUsers = async () => {
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: 'desc' },
  });

  return users.map(sanitizeUser);
};

export const createUser = async (input: CreateUserInput) => {
  const role = await prisma.role.findUnique({ where: { name: input.role } });

  if (!role) {
    throw new ValidationError('Role not found');
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      roleId: role.id,
      status: input.status ?? 'ACTIVE',
    },
    include: { role: true },
  });

  return sanitizeUser(user);
};

export const updateUser = async (userId: string, input: UpdateUserInput) => {
  const existing = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });

  if (!existing) {
    throw new NotFoundError('User not found');
  }

  const data: {
    email?: string;
    passwordHash?: string;
    roleId?: number;
    status?: UserStatus;
  } = {};

  if (input.email) {
    data.email = input.email;
  }

  if (input.password) {
    data.passwordHash = await hashPassword(input.password);
  }

  if (input.role) {
    const role = await prisma.role.findUnique({ where: { name: input.role } });
    if (!role) {
      throw new ValidationError('Role not found');
    }
    data.roleId = role.id;
  }

  if (input.status) {
    data.status = input.status;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    include: { role: true },
  });

  return sanitizeUser(user);
};


