import { getConnection } from 'typeorm';
import Template from '../entities/Template';
import { APP_NAME } from '../../types';

export default class TemplateRepo {
  private static getRepository = () => {
    return getConnection(APP_NAME).getRepository(Template);
  };

  public static getTemplateById = async (id: string) => {
    return TemplateRepo.getRepository().findOne(id, {});
  };

  public static getTemplateByKey = async (key: string) => {
    return TemplateRepo.getRepository().findOne({
      where: {
        key,
      },
    });
  };

  public static getTemplates = async () => {
    return TemplateRepo.getRepository().find({
      select: ['id', 'key', 'name', 'senderName', 'subject'],
      order: {
        createdAt: 'DESC',
      },
    });
  };

  public static createTemplate = async (template: Partial<Template>) => {
    return TemplateRepo.getRepository().save(template);
  };

  public static updateTemplateById = async (id: string, updates: Partial<Template>) => {
    await TemplateRepo.getRepository().update(id, updates);
    return TemplateRepo.getTemplateById(id);
  };
}
