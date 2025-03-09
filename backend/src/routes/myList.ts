import express, { Request, Response } from "express";
import { User } from "../models/User"; // Modelo de usuário
import authMiddleware from "../../src/middleware/authMiddleware"; // Middleware de autenticação

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

router.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(400).json({ message: "Usuário não encontrado." });
    return; // Evita que a função retorne um Response
  }

  try {
    const user = await User.findById(userId).populate("likedMovies");

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.json(user.likedMovies);
  } catch (error) {
    console.error("Erro ao buscar a lista do usuário:", error);
    res.status(500).json({ message: "Erro ao buscar lista de filmes." });
  }
});

export default router;
