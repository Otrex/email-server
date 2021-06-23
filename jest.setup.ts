import DatabaseConnection from './src/database/connection';

beforeAll(async () => {
  await DatabaseConnection.connect();
});

afterAll(async () => {
  await DatabaseConnection.close();
});
