import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../app/service/api';
import "./index.scss";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/auth/login", { username, password });
            localStorage.setItem("token", response.data.token);
            navigate("/");
        } catch (err) {
            setError("Usuário ou senha inválidos.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Entrar</button>
            </form>
            <p className="register-link">Não tem uma conta? <span onClick={() => navigate("/register")} className="link">Cadastre-se</span></p>
        </div>
    );
}
