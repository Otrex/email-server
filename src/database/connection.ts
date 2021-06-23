import { Connection, createConnection } from 'typeorm';

import ormConfig from '../../ormconfig';

export default class DatabaseConnection {
  static connection: Connection | undefined;

  static async connect() {
    DatabaseConnection.connection = await createConnection(ormConfig);
    return DatabaseConnection.connection;
  }

  static async close() {
    await DatabaseConnection.connection?.close();
  }
}
