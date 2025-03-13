import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = express.Router();

// Registro de usuário
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne( {$or: [{ username }, { email }]});
    if (userExists) {
      res.status(400).json({ message: "Usuário ou e-mail já cadastrados." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuário registrado com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor.", error });
  }
});

// Login do usuário
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "Usuário não encontrado." });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Senha incorreta." });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "12h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor.", error });
  }
});

// Logout (simplesmente invalidando o token no frontend)
router.post("/logout", (req: Request, res: Response) => {
  res.json({ message: "Logout realizado com sucesso." });
});

export default router;
