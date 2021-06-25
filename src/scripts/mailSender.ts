/* eslint-disable no-console */
import { Queue, Worker } from 'bullmq';
import sendgrid from '@sendgrid/mail';
import config, { AppEnvironmentEnum } from '../config';
import { generalLogger } from '../lib/logger';
import { ServiceError } from '../lib/errors';

const sendMailQueue = new Queue('mail');

const mailSender = new Worker('sending', async (job) => {
  const { data } = job;
  const {
    template, subject, html, params,
  } = data;

  sendgrid.setApiKey(''); // TODO: this should come from the package configuration
  try {
    if (config.app.env === AppEnvironmentEnum.PRODUCTION) {
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
        return new Promise(() => {
          return true;
        });
      })();
    }

    return {
      data: {},
      message: 'email sent',
    };
  } catch (error) {
    generalLogger.error('unable to send email', error);
    throw new ServiceError('unable to send email');
  }
});

mailSender.on('completed', (job: any) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`${job.id} has completed!`);
});

mailSender.on('failed', (job: any, err: any) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`${job.id} has failed with ${err.message}`);
});

export default sendMailQueue;
