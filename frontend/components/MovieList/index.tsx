import { useEffect, useState } from "react";
import api from "../../app/service/api"; // Importa a API configurada
import MovieCard from "components/MovieCard";
import type { Movie } from "types/movie";
import "./index.scss";

export default function MovieList() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
    const [likedMovies, setLikedMovies] = useState<number[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Verifica se o usuário está logado
        getMovies();
        if (token) fetchRecommendations(); // Busca recomendações ao iniciar, se logado
    }, []);

    const getMovies = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = token 
                ? await api.get("api/movies/logado") 
                : await api.get("api/movies");
            
            setMovies(response.data);

            if (token) {
                const liked = response.data
                    .filter((movie: Movie) => movie.liked)
                    .map((movie: Movie) => movie.id);
                setLikedMovies(liked);
            }
        } catch (error) {
            console.error("Erro ao buscar filmes:", error);
        }
    };

    const fetchRecommendations = async () => {
        try {
            const response = await api.get("/api/movies/recommend-by-genre", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setRecommendedMovies(response.data);
        } catch (error) {
            console.error("Erro ao buscar recomendações:", error);
        }
    };
    

    return (
        <div className="movie-container">
            {!isLoggedIn && <h1 className="popular-title">Filmes Populares</h1>}
            <ul className="movie-list">
                {movies.map((movie) => (
                    <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        onLike={() => {
                            fetchRecommendations(); // Atualiza recomendações ao curtir um filme
                            setLikedMovies([...likedMovies, movie.id]); // Atualiza lista de curtidos
                        }} 
                    />
                ))}
            </ul>

            {likedMovies.length > 0 && recommendedMovies.length > 0 && (
                <>
                    <h1 className="recommended-title">Recomendações para você</h1>
                    <ul className="movie-list">
                        {recommendedMovies.map((movie) => (
                            <MovieCard 
                                key={movie.id} 
                                movie={movie} 
                                onLike={fetchRecommendations} 
                            />
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
