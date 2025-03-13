import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  console.log("Token recebido pelo backend:", token);

  if (!token) {
    res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    return;
  }

  console.log('Token válido recebido:', token);

  try {
    // Verificando o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    // Atribuindo o userId ao req.user
    req.user = { id: decoded.userId };
    
    // Continuar para o próximo middleware ou rota
    next(); 
  } catch (error) {
    console.error("Erro ao verificar token:", error);

    // Verifica se o erro é relacionado à expiração do token
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expirado. Por favor, faça login novamente." });
      return;
    }

    // Caso o erro seja outro
    res.status(401).json({ message: "Token inválido." });
  }
};

export default authMiddleware;
