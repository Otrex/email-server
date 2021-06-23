import { getRepository } from 'typeorm';
import Template from '../entities/Template';

export default class TemplateRepo {
  public static getTemplateById = async (id: string) => {
    return getRepository(Template).findOne(id, {});
  };

  public static getTemplates = async () => {
    return getRepository(Template).find({
      select: ['id', 'name', 'senderName', 'subject'],
      order: {
        createdAt: 'DESC',
      },
    });
  };

  public static createTemplate = async (template: Partial<Template>) => {
    return getRepository(Template).save(template);
  };

  public static updateTemplateById = async (id: string, updates: Partial<Template>) => {
    await getRepository(Template).update(id, updates);
    return TemplateRepo.getTemplateById(id);
  };
}
