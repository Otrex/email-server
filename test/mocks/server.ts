/* eslint-disable no-console */
import app from '.';
import DatabaseConnection from '../../src/database/connection';

DatabaseConnection.connectTest()
  .then(() => {
    app.listen(3000, () => {
      console.log('connected...');
    });
  })
  .catch(() => console.log('failed'));
