import './index.scss';
import { BiLogIn } from "react-icons/bi";

export default function Navbar() {
    return (
        <nav className="navbar">
            <h1 className="page-title">Filmes</h1>

            <button className="login-button">
                <h4 className="inscricao">Login</h4>
                <BiLogIn className="login-icon" />
            </button>
        </nav>
    );
}
