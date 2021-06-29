import {
  Connection, createConnection, createConnections, getConnectionManager,
} from 'typeorm';

export default class DatabaseConnection {
  static connection: Connection | undefined;

  static async connect(config: any) {
    await createConnections([config]);
    return getConnectionManager().connections;
  }

  static async connectTest() {
    DatabaseConnection.connection = await createConnection();
    return DatabaseConnection.connection;
  }

  static async close() {
    await DatabaseConnection.connection?.close();
  }
}
