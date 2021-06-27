import { getConnection } from 'typeorm';
import { APPNAME } from '../../config';
import Template from '../entities/Template';

export default class TemplateRepo {
  public static getTemplateById = async (id: string) => {
    return getConnection(APPNAME).getRepository(Template).findOne(id, {});
  };

  public static getTemplates = async () => {
    return getConnection(APPNAME)
      .getRepository(Template)
      .find({
        select: ['id', 'name', 'senderName', 'subject'],
        order: {
          createdAt: 'DESC',
        },
      });
  };

  public static createTemplate = async (template: Partial<Template>) => {
    return getConnection(APPNAME).getRepository(Template).save(template);
  };

  public static updateTemplateById = async (id: string, updates: Partial<Template>) => {
    await getConnection(APPNAME).getRepository(Template).update(id, updates);
    return TemplateRepo.getTemplateById(id);
  };
}
