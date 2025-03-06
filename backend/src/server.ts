import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import movieRouter from './routes/movies';
import likedRouter from './routes/liked';


const options_env = { path: '.env' };

dotenv.config(options_env);
const app = express();
app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json());
const port = process.env.PORT || 5000;

// Conectando ao MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.log('Erro ao conectar ao MongoDB', err));

// Middleware
app.use(cors());
app.use(express.json());

// Definindo as rotas
app.use('/api/auth', authRouter);
app.use('/api/movies', movieRouter);
app.use('/api/liked', likedRouter);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
