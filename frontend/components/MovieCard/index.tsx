// frontend/components/MovieCard/index.tsx
import { useState, useEffect } from "react";
import api from "../../app/service/api";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";
import type { Movie } from "types/movie";
import StarRating from "components/StarRating";
import "./index.scss";

export interface Props {
    movie: Movie;
    onLike?: (id: number) => void;
}

export default function MovieCard({ movie, onLike }: Props) {
    const [added, setAdded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setLiked(movie.liked);
        }
        // Opcional: você pode recuperar o estado "added" se essa informação estiver disponível no objeto "movie"
    }, [movie.liked]);

    const toggleAdd = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Faça login para adicionar filmes à sua lista!");
            return;
        }
        try {
            if (added) {
                // Se já está na lista, remove
                await api.delete(`/api/mylist/${movie.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Se não está na lista, adiciona
                await api.post(`/api/mylist/`, { id: movie.id }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
            }
            setAdded(!added);
        } catch (error) {
            console.error("Erro ao adicionar/remover filme da lista:", error);
        }
    };

    const toggleLike = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Inscreva-se ou faça seu login para curtir filmes!");
            return;
        }
        try {
            if (liked) {
                await api.delete(`/api/liked/${movie.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await api.post(`/api/liked/`, { id: movie.id }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
            }
            setLiked(!liked);
            if (onLike) onLike(movie.id);
        } catch (error) {
            console.error("Erro ao curtir/remover like do filme:", error);
        }
    };

    return (
        <li className="movie-card">
            <div className="movie-poster" style={{ position: "relative" }}>
                <img 
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} 
                    alt={movie.title}
                />
                <div className="movie-buttons">
                    <button 
                        className={`add-button ${hovered ? "hovered" : ""}`}
                        onClick={toggleAdd}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        {added ? <BsPlusCircleFill color="green" size={24} /> : <BsPlusCircle color="white" size={24} />}
                        <span className="tooltip">Adicionar à lista</span>
                    </button>
                    <button 
                        className={`like-button ${hovered ? "hovered" : ""}`}
                        onClick={toggleLike} 
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        {liked ? <GoHeartFill color="red" size={24} /> : <GoHeart color="red" size={24} />}
                        <span className="tooltip">Gostei</span>
                    </button>
                </div>
            </div>
            <div className="movie-infos">
                <p className="movie-title">{movie.title}</p>
                {movie.vote_average > 0 && <StarRating rating={movie.vote_average} />}
                <div className="hidden-content" style={{ maxHeight: "100px", overflowY: "auto" }}>
                    {movie.overview && <p className="description">{movie.overview}</p>}
                </div>
            </div>
        </li>
    );
}
