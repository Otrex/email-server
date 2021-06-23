import supertest from 'supertest';
import faker from 'faker';
import app from '../../../src/app';

const server = supertest(app);

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
    });
  });
});
