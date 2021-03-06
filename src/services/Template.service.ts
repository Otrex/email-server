import Handlebars from 'handlebars';

import { NotFoundError, ServiceError } from '../lib/errors';
import Validate from '.';

import TemplateRepo from '../database/repositories/TemplateRepo';
import MailQueue from '../queue/mail.queue';
import { generateShortHash } from '../utils';

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
      key: generateShortHash(),
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

  public static getTemplateByKey = async (key: string) => {
    const templates = await TemplateRepo.getTemplateByKey(key);
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

    const { templateId, ...updates } = params;
    template = await TemplateRepo.updateTemplateById(template.id, updates);

    return {
      data: template,
    };
  };

  @Validate({
    $$strict: 'remove',
    templateId: { type: 'uuid' },
    to: { type: 'email', normalize: true },
    fields: { type: 'object', optional: true },
    options: {
      type: 'object',
      optional: true,
      props: {
        delay: { type: 'number', optional: true },
        priority: { type: 'number', positive: true, optional: true },
      },
    },
  })
  public static sendTemplate = async (params: {
    templateId: string;
    to: string;
    fields?: Record<string, any>;
    options?: Record<string, any>;
  }) => {
    const { options } = params;
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
    const renderSubject = Handlebars.compile(template.subject);
    const subject = renderSubject(params.fields);

    const renderBody = Handlebars.compile(template.content);
    const html = renderBody(params.fields);

    await MailQueue.add(
      template.subject,
      {
        template,
        subject,
        html,
        params,
      },
      options,
    );

    return {
      data: {},
      message: 'Email has been queued',
    };
  };

  public static sendEmailByTemplateKey = async (params: {
    templateKey: string;
    to: string;
    fields?: Record<string, any>;
    options?: Record<string, any>;
  }) => {
    const template = await TemplateRepo.getTemplateByKey(params.templateKey);
    if (!template) {
      throw new NotFoundError('template does not exist');
    }
    return TemplateService.sendTemplate({
      templateId: template.id,
      ...params,
    });
  };

  @Validate({
    $$strict: 'remove',
    templateId: { type: 'uuid' },
  })
  public static deleteTemplate = async (params: { templateId: string }) => {
    await TemplateRepo.deleteTemplateById({ id: params.templateId });
    return {
      data: `Email template with id=${params.templateId} has been deleted successfully`,
    };
  };
}
