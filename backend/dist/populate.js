"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Movie_1 = require("./models/Movie");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Conectando ao MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log('Erro ao conectar ao MongoDB', err));
// Função para adicionar filmes
const populateMovies = () => __awaiter(void 0, void 0, void 0, function* () {
    const movies = [
        {
            id: 1,
            title: "Filme 1",
            poster_path: "/caminho/para/poster1.jpg",
            overview: "Descrição do Filme 1",
            vote_average: 7.5
        },
        {
            id: 2,
            title: "Filme 2",
            poster_path: "/caminho/para/poster2.jpg",
            overview: "Descrição do Filme 2",
            vote_average: 8.0
        }
    ];
    try {
        yield Movie_1.Movie.insertMany(movies);
        console.log("Filmes adicionados com sucesso!");
    }
    catch (error) {
        console.error("Erro ao adicionar filmes:", error);
    }
    finally {
        mongoose_1.default.disconnect();
    }
});
populateMovies();
