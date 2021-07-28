import express from 'express';

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
