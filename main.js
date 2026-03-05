import 'dotenv/config';
import express from 'express';
import productRouter from './router/product.router.js';
import testRouter from './router/testing.router.js';

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use('/products', productRouter);
app.use('/users', testRouter);

app.listen(port, () => {
    console.log(`app running port ${port}`);
});