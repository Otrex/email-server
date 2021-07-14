import { Job } from 'bullmq';
import sendgrid from '@sendgrid/mail';
import { generalLogger } from '../lib/logger';
import { ServiceError } from '../lib/errors';

export default async (job: Job, sendgridApiKey: string) => {
  const {
    template, subject, html, params,
  } = job.data;
  try {
    if (sendgridApiKey) {
      sendgrid.setApiKey(sendgridApiKey);
      await sendgrid.send({
        from: {
          email: template.from,
          name: template.senderName,
        },
        to: params.to,
        subject,
        html,
      });
    } else {
      await (async () => {
        return new Promise((resolve) => {
          // eslint-disable-next-line no-console
          console.log('Sending Mail tester Working...');
          return setTimeout(resolve, 2000);
        });
      })();
    }

    return {
      data: job.data.params.to,
      message: 'email sent',
    };
  } catch (error) {
    generalLogger.error('unable to send email', error);
    throw new ServiceError('unable to send email');
  }
};
