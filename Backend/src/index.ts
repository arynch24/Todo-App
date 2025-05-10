import express from 'express';
import rootRouter from './routes/index.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: ["https://routine-three-nu.vercel.app","http://localhost:5173"], 
  credentials: true,            
}));

//if the request comes to /api go to rootrouter
app.use(express.json());
app.use('/api', rootRouter);

app.listen(3000, () => {
  console.log("Server is Running");
})
