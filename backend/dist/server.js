"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const movies_1 = __importDefault(require("./routes/movies"));
const liked_1 = __importDefault(require("./routes/liked"));
const options_env = { path: '.env' };
dotenv_1.default.config(options_env);
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
app.use(express_1.default.json());
const port = process.env.PORT || 5000;
// Conectando ao MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log('Erro ao conectar ao MongoDB', err));
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Definindo as rotas
app.use('/api/auth', auth_1.default);
app.use('/api/movies', movies_1.default);
app.use('/api/liked', liked_1.default);
// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
