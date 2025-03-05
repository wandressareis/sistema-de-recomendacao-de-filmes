import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../app/service/api";
import "./index.scss";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        try {
            await api.post("/api/auth/register", { username, email, password });
            navigate("/login");
        } catch (err) {
            setError("Erro ao criar conta. Tente novamente.");
        }
    };

    return (
        <div className="register-container">
            <h2>Criar Conta</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Confirme a senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit">Registrar</button>
            </form>
            <p className="login-link">Já tem uma conta? <span onClick={() => navigate("/login")} className="link">Faça login</span></p>
        </div>
    );
}