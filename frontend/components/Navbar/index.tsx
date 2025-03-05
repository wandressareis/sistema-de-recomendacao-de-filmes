import { useNavigate, useLocation } from "react-router-dom";
import "./index.scss";
import { BiLogIn } from "react-icons/bi";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    return (
        <nav className="navbar">
            <h1 className="page-title" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Filmes</h1>
            {!isAuthPage && (
                <button className="login-button" onClick={() => navigate("/login")}> 
                    <h4 className="inscricao">Login</h4>
                    <BiLogIn className="login-icon" />
                </button>
            )}
        </nav>
    );
}