import { DocumentType } from '@prisma/client';

import { NotFoundError } from '../../core/error';
import { prisma } from '../../lib/prisma';
import type {
  CreateTemplateInput,
  ListTemplateQueryInput,
  UpdateTemplateInput,
} from './templates.schemas';

const buildWhere = (filters: ListTemplateQueryInput) => {
  const where: {
    type?: DocumentType;
    isActive?: boolean;
  } = {};

  if (filters.type) {
    where.type = filters.type;
  }

  if (typeof filters.active === 'boolean') {
    where.isActive = filters.active;
  }

  return where;
};

export const listTemplates = async (filters: ListTemplateQueryInput) => {
  return prisma.documentTemplate.findMany({
    where: buildWhere(filters),
    orderBy: [
      { type: 'asc' },
      { version: 'desc' },
    ],
  });
};

export const createTemplate = async (input: CreateTemplateInput) => {
  return prisma.documentTemplate.create({
    data: {
      name: input.name,
      description: input.description,
      type: input.type,
      version: input.version ?? 'v1',
      storageKey: input.storageKey,
      isActive: input.isActive ?? true,
    },
  });
};

export const updateTemplate = async (templateId: string, input: UpdateTemplateInput) => {
  const template = await prisma.documentTemplate.findUnique({ where: { id: templateId } });

  if (!template) {
    throw new NotFoundError('Template not found');
  }

  return prisma.documentTemplate.update({
    where: { id: templateId },
    data: input,
  });
};

