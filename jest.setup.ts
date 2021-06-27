import DatabaseConnection from './src/database/connection';

beforeAll(async () => {
  await DatabaseConnection.connectTest();
});

afterAll(async () => {
  await DatabaseConnection.close();
});
