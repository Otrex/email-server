import { NotFoundError } from '../lib/errors';
import TemplateService from '../services/Template.service';

export type Params = {
  to: string;
  fields: any;
  options?: { delay: number; priority: number };
};
export default async (templateSlug: string, params: Params | any) => {
  const { data } = await TemplateService.getTemplateBySlug(templateSlug);
  if (!data) {
    throw new NotFoundError('template does not exist');
  }
  return TemplateService.sendTemplate({
    templateId: data.id,
    ...params,
  });
};
