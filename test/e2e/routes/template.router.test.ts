import supertest from 'supertest';
import faker from 'faker';
import app from '../../../src/app';

const server = supertest(app);
const data: any = {};

beforeAll(async () => {});

describe('Template Router', () => {
  describe('Create template', () => {
    it('should create a template', async () => {
      const res = await server.post('/templates').send({
        name: faker.company.companyName(),
      });
      expect(res.status).toEqual(200);
    });
  });

  describe('Fetch templates', () => {
    it('should fetch templates', async () => {
      const res = await server.get('/templates').send();
      expect(res.status).toEqual(200);
      expect(res.body.data).toBeDefined();
      data.templates = res.body.data;
    });
  });

  describe('Fetch template', () => {
    it('should fetch template with templateId', async () => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await server.get(`/templates/${data.templates[0].id}`).send();
      expect(res.status).toEqual(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('Update template with templateId', () => {
    it('should update template', async () => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await server.patch(`/templates/${data.templates[0].id}`).send({
        name: 'treasure',
        from: 'obisike@yahoo.com',
        senderName: 'Obisike',
        content: 'This is the only thing that matters',
      });
      expect(res.status).toEqual(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('Send Mail Failed due to subject not added', () => {
    it('should send mail', async () => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await server.post(`/templates/${data.templates[0].id}/send`).send({
        to: 'trex@gmail.com',
        fields: { to: 'rex@yahoo.com' },
      });
      expect(res.status).toEqual(400);
      expect(res.body.message).toContain('subject');
    });
  });
  describe('Should update subject', () => {
    it('should update subject mail', async () => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await server.patch(`/templates/${data.templates[0].id}`).send({
        subject: 'Flitaa Mail',
      });
      expect(res.status).toEqual(200);
      expect(res.body.data).toBeDefined();
    });
  });
  describe('Send Mail', () => {
    it('should send mail', async () => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await server.post(`/templates/${data.templates[0].id}/send`).send({
        to: 'trex@gmail.com',
        fields: { to: 'rex@yahoo.com' },
      });
      expect(res.status).toEqual(200);
      expect(res.body.data).toBeDefined();
    });
  });
});
