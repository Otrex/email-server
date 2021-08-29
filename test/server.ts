/* eslint-disable no-console */
import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('test server running');
});
