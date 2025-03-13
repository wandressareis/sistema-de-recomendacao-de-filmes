// backend/src/routes/like.ts
import { Router, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import authMiddleware, { AuthenticatedRequest } from "../middleware/authMiddleware";
import dotenv from 'dotenv';
import { Like } from "../models/Like";

dotenv.config();

const likedRouter = Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

likedRouter.post("/", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    const likeFinded = await Like.findOne({ user_id: userId, movie_id: id });

    if (likeFinded) {
      res.status(500).json({ message: "O filme já foi curtido." });
      return;
    }

    const like = await Like.create({ user_id: userId, movie_id: id, genres: [] });
    like.save();

    console.log(like);
    res.json(like);
  } catch (error) {
    console.error("Erro ao curtir o filme:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

likedRouter.delete("/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "ID do filme é obrigatório." });
    return;
  }

  try {
    const likeFinded = await Like.findOneAndDelete({ user_id: userId, movie_id: id });

    if (!likeFinded) {
      res.status(404).json({ message: "O filme não está curtido." });
      return;
    }

    res.json({ message: "Like removido com sucesso.", movie_id: id });
  } catch (error) {
    console.error("Erro ao remover o like:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

export default likedRouter;
