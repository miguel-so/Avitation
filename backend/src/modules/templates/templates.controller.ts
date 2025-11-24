import type { Request, Response } from 'express';

import { ValidationError } from '../../core/error';
import { created, ok } from '../../core/http';
import {
  createTemplateSchema,
  listTemplatesQuerySchema,
  templateIdParamsSchema,
  updateTemplateSchema,
} from './templates.schemas';
import { createTemplate, listTemplates, updateTemplate } from './templates.service';

export const listTemplatesHandler = async (req: Request, res: Response) => {
  const parsed = listTemplatesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new ValidationError('Invalid template filters', parsed.error.flatten());
  }

  const templates = await listTemplates(parsed.data);
  return ok(res, templates);
};

export const createTemplateHandler = async (req: Request, res: Response) => {
  const parsed = createTemplateSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError('Invalid template payload', parsed.error.flatten());
  }

  const template = await createTemplate(parsed.data);
  return created(res, template);
};

export const updateTemplateHandler = async (req: Request, res: Response) => {
  const paramsResult = templateIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new ValidationError('Invalid template id', paramsResult.error.flatten());
  }

  const bodyResult = updateTemplateSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new ValidationError('Invalid template payload', bodyResult.error.flatten());
  }

  const template = await updateTemplate(paramsResult.data.templateId, bodyResult.data);
  return ok(res, template);
};

