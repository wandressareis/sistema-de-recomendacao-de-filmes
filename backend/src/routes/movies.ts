import express from "express";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

router.get("/", async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`
        );

        const movies = response.data.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            overview: movie.overview,
            vote_average: movie.vote_average,
        }));

        res.json(movies);
    } catch (error) {
        console.error("Erro ao buscar filmes do TMDB:", error);
        res.status(500).json({ error: "Erro ao buscar filmes" });
    }
});

export default router;
