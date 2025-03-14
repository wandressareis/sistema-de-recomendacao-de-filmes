// frontend/components/MovieList/index.tsx
import { useEffect, useState } from "react";
import api from "../../app/service/api";
import MovieCard from "components/MovieCard";
import type { Movie } from "types/movie";
import "./index.scss";

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [personalRecommendations, setPersonalRecommendations] = useState<Movie[]>([]);
  const [collaborativeRecommendations, setCollaborativeRecommendations] = useState<Movie[]>([]);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    getMovies();
    if (token) fetchRecommendations();
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
      const token = localStorage.getItem("token");
      const response = await api.get("api/movies/recommendations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // A resposta contém: { personalRecommendations, collaborativeRecommendations }
      setPersonalRecommendations(response.data.personalRecommendations || []);
      setCollaborativeRecommendations(response.data.collaborativeRecommendations || []);
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
    }
  };

  return (
    <div className="movie-container">
      {!isLoggedIn && (
        <div className="section popular-section">
          <h1 className="section-title">Filmes Mais Curtidos</h1>
          <ul className="movie-list">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onLike={fetchRecommendations} />
            ))}
          </ul>
        </div>
      )}

      {personalRecommendations.length > 0 && (
        <div className="section personal-section">
          <h1 className="section-title">Suas Recomendações</h1>
          <ul className="movie-list">
            {personalRecommendations.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onLike={fetchRecommendations} />
            ))}
          </ul>
        </div>
      )}

      {collaborativeRecommendations.length > 0 && (
        <div className="section collaborative-section">
          <h1 className="section-title">Filmes Mais Curtidos</h1>
          <ul className="movie-list">
            {collaborativeRecommendations.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onLike={fetchRecommendations} />
            ))}
          </ul>
        </div>
      )}
    </div>

  );
}
