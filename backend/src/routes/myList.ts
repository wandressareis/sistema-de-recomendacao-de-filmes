import { Router, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";
import dotenv from "dotenv";
import { MyList } from "../models/MyList"; // Supondo que existe um modelo MyList

dotenv.config();

const myListRouter = Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Adiciona um filme à "Minha Lista"
myListRouter.post("/", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.body; // id do filme

  if (!id) {
    res.status(400).json({ message: "ID do filme é obrigatório." });
    return;
  }

  // Verifica se o ID é válido no MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "ID do filme inválido." });
    return;
  }

  try {
    // Valida o filme com a API do TMDB
    await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?language=pt-br&api_key=${TMDB_API_KEY}`
    );

    // Verifica se o filme já foi adicionado à lista
    const movieInList = await MyList.findOne({ user_id: userId, movie_id: id });

    if (movieInList) {
      res.status(500).json({ message: "O filme já foi adicionado à lista." });
      return;
    }

    // Adiciona o filme à lista do usuário
    const movie = await MyList.create({ user_id: userId, movie_id: id });
    await movie.save();

    console.log(movie);
    res.json(movie);
  } catch (error) {
    console.error("Erro ao adicionar o filme à lista:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// Remove um filme da "Minha Lista"
myListRouter.delete("/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "ID do filme é obrigatório." });
    return;
  }

  try {
    const movieInList = await MyList.findOneAndDelete({ user_id: userId, movie_id: id });

    if (!movieInList) {
      res.status(404).json({ message: "O filme não está na sua lista." });
      return;
    }

    res.json({ message: "Filme removido com sucesso da sua lista.", movie_id: id });
  } catch (error) {
    console.error("Erro ao remover o filme da lista:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

export default myListRouter;
