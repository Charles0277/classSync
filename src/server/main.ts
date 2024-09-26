import express from 'express';
import ViteExpress from 'vite-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './router/index.js';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => console.log('Connected to MongoDB ' + mongoose.connection.port))
    .catch((error) => console.error('MongoDB connection error:', error));

app.get('/hello', (_, res) => {
    res.send('Hello Vite + React + TypeScript + Charles!');
});

app.use('/', router());

ViteExpress.listen(app, 3000, () =>
    console.log('Server is listening on port 3000...')
);
