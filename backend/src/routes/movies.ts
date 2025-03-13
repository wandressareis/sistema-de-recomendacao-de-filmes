import express from "express";
import axios from "axios";
import dotenv from 'dotenv';
import { Like } from "../models/Like";
import { Response } from "express";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";

dotenv.config();

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

router.get("/logado", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

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

        const likes = await Like.find({ user_id: userId });
        const likedMovieIds = new Set(likes.map(like => like.movie_id));

        const updatedMovies = movies.map(movie => ({
        ...movie,
        liked: likedMovieIds.has(movie.id)
        }));

        res.json(updatedMovies);
    } catch (error) {
        console.error("Erro ao buscar filmes do TMDB:", error);
        res.status(500).json({ error: "Erro ao buscar filmes" });
    }
});

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
            liked: false,
        }));
 
        res.json(movies);
    } catch (error) {
        console.error("Erro ao buscar filmes do TMDB:", error);
        res.status(500).json({ error: "Erro ao buscar filmes" });
    }
});

router.get("/recommendations", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    try {
        // Buscar filmes curtidos pelo usuário
        const likedMovies = await Like.find({ user_id: userId });

        if (likedMovies.length === 0) {
            res.json([]); // Se não houver likes, retorna uma lista vazia
            return;
        }

        const uniqueRecommendedMovies = new Map();

        // Para cada filme curtido, busca
        // r recomendações
        for (const like of likedMovies) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${like.movie_id}/recommendations?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`
            );

            response.data.results.forEach((movie: any) => {
                if (!uniqueRecommendedMovies.has(movie.id)) {
                    uniqueRecommendedMovies.set(movie.id, {
                        id: movie.id,
                        title: movie.title,
                        poster_path: movie.poster_path,
                        overview: movie.overview,
                        vote_average: movie.vote_average,
                    });
                }
            });
        }

        res.json(Array.from(uniqueRecommendedMovies.values())); // Retorna os filmes recomendados sem duplicação
    } catch (error) {
        console.error("Erro ao buscar recomendações personalizadas:", error);
        res.status(500).json({ error: "Erro ao buscar recomendações personalizadas" });
    }
});


export default router;
