import express from 'express';
import rootRouter from './routes/index';
import cors from 'cors';
const app = express();
app.use(cors({
    origin: '*',
    credentials: true,
}));
//if the request comes to /api go to rootrouter
app.use('/api', rootRouter);
app.use(express.json());
app.listen(3000, () => {
    console.log("Server is Running");
});
