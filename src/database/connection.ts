import { Connection, createConnection, getConnection } from 'typeorm';

export default class DatabaseConnection {
  static connection: Connection | undefined;

  static async connect(config: any) {
    await createConnection(config);
    return getConnection(config.name);
  }
}
