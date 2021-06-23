import Handlebars from 'handlebars';
import sendgrid from '@sendgrid/mail';

import { NotFoundError, ServiceError } from '../lib/errors';
import Validate from '.';

import { generalLogger } from '../lib/logger';

import TemplateRepo from '../database/repositories/TemplateRepo';

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
    from: { type: 'email', normalize: true },
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
    const {
      name, from, senderName, content,
    } = params;
    template = await TemplateRepo.updateTemplateById(template.id, {
      name,
      from,
      senderName,
      content,
    });

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
      throw new ServiceError('template from email is not set');
    }

    const renderSubject = Handlebars.compile(template.subject);
    const subject = renderSubject(params.fields);

    const renderBody = Handlebars.compile(template.content);
    const html = renderBody(params.fields);

    sendgrid.setApiKey(''); // TODO: this should come from the package configuration

    try {
      await sendgrid.send({
        from: {
          email: template.from,
          name: template.senderName,
        },
        to: params.to,
        subject,
        html,
      });
      return {
        data: {},
        message: 'email sent',
      };
    } catch (error) {
      generalLogger.error('unable to send email', error);
      throw new ServiceError('unable to send email');
    }
  };
}
