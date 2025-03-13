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

router.get("/recommend-by-genre", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    try {
        // Buscar os filmes curtidos pelo usuário
        const likes = await Like.find({ user_id: userId });

        if (likes.length === 0) {
            res.json([]); // Apenas envia a resposta sem usar `return`
            return;
        }

        // Buscar detalhes dos filmes curtidos
        const likedMoviesDetails = await Promise.all(
            likes.map(async (like) => {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${like.movie_id}?api_key=${TMDB_API_KEY}&language=pt-BR`
                );
                return response.data;
            })
        );

        // Contar quantas vezes cada gênero foi curtido
        const genreCount: Record<number, number> = {};
        likedMoviesDetails.forEach((movie) => {
            movie.genres.forEach((genre: { id: number }) => {
                genreCount[genre.id] = (genreCount[genre.id] || 0) + 1;
            });
        });

        // Identificar os 2 gêneros mais curtidos
        const topGenres = Object.entries(genreCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([genreId]) => genreId);

        // Buscar filmes populares dentro dos gêneros favoritos
        const recommendedMovies: any[] = [];
        for (const genreId of topGenres) {
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=popularity.desc&with_genres=${genreId}`
            );
            recommendedMovies.push(...response.data.results);
        }

        // Remover duplicatas e enviar resposta
        const uniqueMovies = Array.from(new Map(recommendedMovies.map((movie) => [movie.id, movie])).values());
        res.json(uniqueMovies);
    } catch (error) {
        console.error("Erro ao buscar recomendações por gênero:", error);
        res.status(500).json({ error: "Erro ao buscar recomendações" });
    }
});


export default router;
