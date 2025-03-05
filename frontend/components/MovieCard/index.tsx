import { useState } from "react";
import api from "../../app/service/api";
import { GoHeart, GoHeartFill } from "react-icons/go";
import type { Movie } from "types/movie";
import StarRating from "components/StarRating";
import './index.scss';

export interface Props {
    movie: Movie;
}

export default function MovieCard({ movie }: Props) {
    const [liked, setLiked] = useState(false);
    const [hovered, setHovered] = useState(true);

    const toggleLike = async () => {
        const token = localStorage.getItem("token"); // Verifica se o usuário está autenticado
        
        if (!token) {
            alert("Inscreva-se ou faça seu login para curtir filmes!");
            return;
        }

        if (!liked) {
            try {
                await api.post(`/liked/${movie.id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLiked(true);
            } catch (error) {
                console.error("Erro ao curtir o filme:", error);
            }
        }
    };
    
    return (
        <li className="movie-card">
            <div className="movie-poster" style={{ position: 'relative' }}>
                <img 
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} 
                    alt={movie.title}
                />
                <button 
                    className={`like-button ${hovered ? "hovered" : ""}`}
                    onClick={toggleLike} 
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {liked ? <GoHeartFill color="red" size={24}/> : <GoHeart color="red" size={24} />}
                </button>
            </div>
            <div className="movie-infos">
                <p className="movie-title">
                    {movie.title}
                </p>
                {movie.vote_average > 0 && 
                    <StarRating rating={movie.vote_average} />
                }
                <div className="hidden-content" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {movie.overview &&                     
                        <p className="description">
                            {movie.overview}
                        </p>
                    }
                </div>
            </div>
        </li>
    );
}
