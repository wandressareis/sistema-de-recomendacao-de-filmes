"use client";
import { useState } from "react";
import api from "../../app/service/api";
import { useRouter } from "next/navigation";
import "./index.scss";

interface AuthFormProps {
  type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/register";
      const response = await api.post(endpoint, { username, password });

      if (type === "login") {
        localStorage.setItem("token", response.data.token);
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Erro ao autenticar. Verifique seus dados.");
    }
  };

  return (
    <div className="auth-container">
      <h2>{type === "login" ? "Login" : "Criar Conta"}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{type === "login" ? "Entrar" : "Registrar"}</button>
      </form>
    </div>
  );
}
