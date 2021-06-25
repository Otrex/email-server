import Handlebars from 'handlebars';

import { NotFoundError, ServiceError } from '../lib/errors';
import Validate from '.';

import TemplateRepo from '../database/repositories/TemplateRepo';
import sendMailQueue from '../scripts/mailSender';

export default class TemplateService {
  @Validate({
    $$strict: 'remove',
    name: { type: 'string', trim: true },
    from: { type: 'string', trim: true, optional: true },
    senderName: { type: 'string', trim: true, optional: true },
    subject: { type: 'string', trim: true, optional: true },
  })
  public static createTemplate = async (params: {
    name: string;
    from?: string;
    senderName?: string;
    subject?: string;
  }) => {
    const {
      name, from, senderName, subject,
    } = params;
    const template = await TemplateRepo.createTemplate({
      name,
      from,
      senderName,
      subject,
    });

    return {
      data: template,
    };
  };

  public static getTemplates = async () => {
    const templates = await TemplateRepo.getTemplates();
    return {
      data: templates,
    };
  };

  @Validate({
    $$strict: 'remove',
    templateId: { type: 'uuid' },
  })
  public static getTemplate = async (params: { templateId: string }) => {
    const template = await TemplateRepo.getTemplateById(params.templateId);
    if (!template) {
      throw new NotFoundError('template does not exist');
    }
    return {
      data: template,
    };
  };

  @Validate({
    $$strict: 'remove',
    templateId: { type: 'uuid' },
    name: { type: 'string', trim: true, optional: true },
    from: { type: 'email', normalize: true, optional: true },
    subject: { type: 'string', trim: true, optional: true },
    senderName: { type: 'string', trim: true, optional: true },
    content: { type: 'string', optional: true },
  })
  public static updateTemplate = async (params: {
    templateId: string;
    name?: string;
    from?: string;
    senderName?: string;
    subject?: string;
    content?: string;
  }) => {
    let template = await TemplateRepo.getTemplateById(params.templateId);
    if (!template) {
      throw new NotFoundError('template does not exist');
    }

    const data = Object.entries(params).filter(([key, value]) => {
      return value !== null && value !== undefined && key !== 'templateId';
    });

    template = await TemplateRepo.updateTemplateById(template.id, Object.fromEntries(data));

    return {
      data: template,
    };
  };

  @Validate({
    $$strict: 'remove',
    templateId: { type: 'uuid' },
    to: { type: 'email', normalize: true },
    fields: { type: 'object', optional: true },
  })
  public static sendTemplate = async (params: {
    templateId: string;
    to: string;
    fields?: Record<string, any>;
  }) => {
    const template = await TemplateRepo.getTemplateById(params.templateId);
    if (!template) {
      throw new NotFoundError('template does not exist');
    }

    if (!template.from) {
      throw new ServiceError('template `from email` is not set');
    }

    if (!template.subject) {
      throw new ServiceError('template `subject` is not set');
    }
    // console.log(template);
    const renderSubject = Handlebars.compile(template.subject);
    const subject = renderSubject(params.fields);

    const renderBody = Handlebars.compile(template.content);
    const html = renderBody(params.fields);

    await sendMailQueue.add('sending', {
      template,
      subject,
      html,
      params,
    });

    return { data: 'Message is sending' };
  };
}
