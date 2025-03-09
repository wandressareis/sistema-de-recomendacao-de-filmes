import { useState } from "react";
import api from "../../app/service/api";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { BsPlusCircle, BsPlusCircleFill } from "react-icons/bs"; // Ícones do botão adicionar
import type { Movie } from "types/movie";
import StarRating from "components/StarRating";
import './index.scss';

export interface Props {
    movie: Movie;
}

export default function MovieCard({ movie }: Props) {
    const [added, setAdded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [hovered, setHovered] = useState(true);

    const token = localStorage.getItem("token"); // Verifica se o usuário está autenticado

    const toggleAdd = async () => {
        if (!token) {
            alert("Inscreva-se ou faça seu login para adicionar filmes!");
            return;
        }

        try {
            await api.post(`/added/${movie.id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdded(!added);
        } catch (error) {
            console.error("Erro ao adicionar o filme:", error);
        }
    };
    const toggleLike = async () => {
        if (!token) {
            alert("Inscreva-se ou faça seu login para curtir filmes!");
            return;
        }

        try {
            await api.post(`/liked/${movie.id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLiked(!liked);
        } catch (error) {
            console.error("Erro ao curtir o filme:", error);
        }
    };


    return (
        <li className="movie-card">
            <div className="movie-poster" style={{ position: 'relative' }}>
                <img 
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} 
                    alt={movie.title}
                />
                <div className="movie-buttons">
                    {/* Botão Adicionar */}
                    <button 
                        className={`add-button ${hovered ? "hovered" : ""}`}
                        onClick={toggleAdd}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        {added ? <BsPlusCircleFill color="green" size={24} /> : <BsPlusCircle color="white" size={24} />}
                        <span className="tooltip">Adicionar à lista</span>
                    </button>
                    {/* Botão Curtir */}
                    <button 
                        className={`like-button ${hovered ? "hovered" : ""}`}
                        onClick={toggleLike} 
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        {liked ? <GoHeartFill color="red" size={24}/> : <GoHeart color="red" size={24} />}
                        <span className="tooltip">Gostei</span>
                    </button>

                </div>
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
