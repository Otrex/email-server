import { Request } from 'express';
import { wrapHandler } from '.';
import TemplateService from '../services/Template.service';

export default class TemplateController {
  public static getTemplates = wrapHandler(() => {
    return TemplateService.getTemplates();
  });

  public static getTemplate = wrapHandler((req: Request) => {
    return TemplateService.getTemplate({
      templateId: req.params.templateId,
    });
  });

  public static createTemplate = wrapHandler((req: Request) => {
    return TemplateService.createTemplate({
      ...req.body,
    });
  });

  public static updateTemplate = wrapHandler((req: Request) => {
    return TemplateService.updateTemplate({
      ...req.params,
      ...req.body,
    });
  });

  public static sendTemplate = wrapHandler((req: Request) => {
    return TemplateService.sendTemplate({
      ...req.params,
      ...req.body,
    });
  });
}
