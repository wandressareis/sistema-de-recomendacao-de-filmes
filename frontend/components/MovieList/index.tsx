import { useEffect, useState } from "react";
import api from "../../app/service/api"; // Importa a API configurada
import MovieCard from "components/MovieCard";
import type { Movie } from 'types/movie';
import './index.scss';

export default function MovieList() {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        getMovies();
    }, []);

    const getMovies = async () => {
        try {
            const response = await api.get("api/movies"); // Chama o backend
            setMovies(response.data);
        } catch (error) {
            console.error("Erro ao buscar filmes:", error);
        }
    };

    return (
        <ul className="movie-list">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </ul>
    );
}
