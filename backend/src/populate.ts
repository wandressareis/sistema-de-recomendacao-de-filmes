import { Movie } from './models/Movie';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Conectando ao MongoDB
mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log('Erro ao conectar ao MongoDB', err));

// Função para adicionar filmes
const populateMovies = async () => {
    const movies = [
        {
            id: 1,
            title: "Filme 1",
            poster_path: "/caminho/para/poster1.jpg",
            overview: "Descrição do Filme 1",
            vote_average: 7.5
        },
        {
            id: 2,
            title: "Filme 2",
            poster_path: "/caminho/para/poster2.jpg",
            overview: "Descrição do Filme 2",
            vote_average: 8.0
        }
    ];

    try {
        await Movie.insertMany(movies);
        console.log("Filmes adicionados com sucesso!");
    } catch (error) {
        console.error("Erro ao adicionar filmes:", error);
    } finally {
        mongoose.disconnect();
    }
};

populateMovies();