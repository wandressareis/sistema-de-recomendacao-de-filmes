import { useEffect, useState } from "react";
import api from "../../app/service/api"; // Importa a API configurada
import MovieCard from "components/MovieCard";
import type { Movie } from "types/movie";
import "./index.scss";

export default function MovieList() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Verifica se o usuário está logado
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
        <div className="movie-container">
            {!isLoggedIn && <h1 className="popular-title">Filmes Populares</h1>}
            <ul className="movie-list">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </ul>
        </div>
    );
}
