import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    return; // Adicionando return explícito
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.user = { id: decoded.userId };
    next(); // Sempre chama next() se passar na verificação
  } catch (error) {
    res.status(401).json({ message: "Token inválido." });
    return; // Adicionando return explícito
  }
};

export default authMiddleware;
