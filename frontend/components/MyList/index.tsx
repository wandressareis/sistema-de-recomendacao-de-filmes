import { useState, useEffect } from "react";
import api from "../../app/service/api";
import MovieCard from "components/MovieCard";
import type { Movie } from "types/movie";
import './index.scss';

export default function MyList() {
    const [myList, setMyList] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMyList = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Faça login para ver sua lista!");
                return;
            }

            try {
                const response = await api.get("/mylist", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMyList(response.data);
            } catch (error) {
                console.error("Erro ao carregar a lista:", error);
            }
        };

        fetchMyList();
    }, []);

    return (
        <div className="my-list">
            <h2>Minha Lista</h2>
            <ul className="movie-list">
                {myList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </ul>
        </div>
    );
}
