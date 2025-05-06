import express from 'express';
import rootRouter from './routes/index.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: "https://routine-three-nu.vercel.app/", // frontend origin
  credentials: true,              // 👈 this is important
}));

//if the request comes to /api go to rootrouter
app.use('/api', rootRouter);
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is Running");
})
