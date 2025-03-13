// backend/src/routes/movies.ts
import express from "express";
import axios from "axios";
import dotenv from 'dotenv';
import { Like } from "../models/Like";
import { Response } from "express";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";

dotenv.config();

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Endpoint para usuários logados: obtém filmes populares e marca os filmes curtidos pelo usuário
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

// Endpoint para usuários não logados: obtém filmes populares
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

// Endpoint de recomendações: retorna tanto as personalizadas quanto as colaborativas
router.get("/recommendations", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    try {
        // ***** Recomendações Personalizadas *****
        const likedMovies = await Like.find({ user_id: userId });
        let personalRecommendations = [];
        
        if (likedMovies.length > 0) {
            const uniqueRecommendedMovies = new Map();
            // Para cada filme curtido, busca recomendações via TMDB
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
            personalRecommendations = Array.from(uniqueRecommendedMovies.values()).slice(0, 24); // Limita a 24 filmes
        }

        // ***** Recomendações Colaborativas *****
        // Agrupa os likes de todos os usuários por movie_id e conta quantas curtidas cada filme recebeu
        const aggregatedLikes = await Like.aggregate([
            {
                $group: {
                    _id: "$movie_id",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 24 } // Limita aos 24 filmes mais curtidos
        ]);

        // Exclui os filmes que o usuário já curtiu
        const userLikedMovieIds = likedMovies.map(like => like.movie_id);
        const filteredAggregated = aggregatedLikes.filter(item => !userLikedMovieIds.includes(item._id));

        // Busca os detalhes de cada filme na API do TMDB
        const collaborativePromises = filteredAggregated.map(async (item) => {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${item._id}?language=pt-BR&api_key=${TMDB_API_KEY}`
            );
            const movie = response.data;
            return {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                overview: movie.overview,
                vote_average: movie.vote_average,
                likeCount: item.count
            };
        });
        const collaborativeRecommendations = await Promise.all(collaborativePromises);

        // Limita as recomendações colaborativas para 24
        const limitedCollaborativeRecommendations = collaborativeRecommendations.slice(0, 24);

        // Retorna as duas listas de recomendações
        res.json({
            personalRecommendations,
            collaborativeRecommendations: limitedCollaborativeRecommendations
        });
    } catch (error) {
        console.error("Erro ao buscar recomendações:", error);
        res.status(500).json({ error: "Erro ao buscar recomendações" });
    }
});

export default router;
