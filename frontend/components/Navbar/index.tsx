import { useNavigate, useLocation } from "react-router-dom";
import { BiLogIn, BiLogOut, BiHomeAlt } from "react-icons/bi";
import "./index.scss";
import { useEffect, useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    return (
        <nav className="navbar">
            <h1 className="page-title" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Filmes</h1>
            
            {/* Botão de Redirecionamento para a página principal nas páginas de login e cadastro */}
            {isAuthPage && (
                <button className="home-button" onClick={() => navigate("/")}>
                    <h4 className="inscricao">Início</h4>
                    <BiHomeAlt className="home-icon" />
                </button>
            )}

            {!isAuthPage && (
                isLoggedIn ? (
                    <button className="logout-button" onClick={handleLogout}>
                        <h4 className="inscricao">Sair</h4>
                        <BiLogOut className="logout-icon" />
                    </button>
                ) : (
                    <button className="login-button" onClick={() => navigate("/login")}>
                        <h4 className="inscricao">Login</h4>
                        <BiLogIn className="login-icon" />
                    </button>
                )
            )}
        </nav>
    );
}
