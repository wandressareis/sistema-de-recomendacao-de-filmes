import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import movieRouter from './routes/movies';
import likedRouter from './routes/like';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: '.env' });

const app = express();
const port = process.env.PORT || 5000;

// Configurar middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Conectando ao MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.log('Erro ao conectar ao MongoDB', err));

// Definindo as rotas
app.use('/api/auth', authRouter);
app.use('/api/movies', movieRouter);
app.use('/api/liked', likedRouter);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
