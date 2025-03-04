import { useState } from "react";
import api from "../service/api"; // Importa o serviço de API
import './Login.scss'

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/auth/login", { email, password });

            localStorage.setItem("token", response.data.token);
            alert("Login bem-sucedido!");
        } catch (err) {
            setError("Falha no login. Verifique suas credenciais.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}
