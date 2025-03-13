import mongoose, { Schema, Document } from "mongoose";

// Interface para o modelo Movie
interface IMovie extends Document {
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  likes: string[]; // Lista de IDs de usuários que curtiram
} 

// Definindo o schema para o filme
const movieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true },
    poster_path: { type: String, required: true },
    overview: { type: String, required: true },
    vote_average: { type: Number, required: true },
    likes: { type: [String], default: [] }, // Lista de usuários que curtiram
  },
  { timestamps: true }
);

// Criando o modelo Movie com base no schema
const Movie = mongoose.model<IMovie>("Movie", movieSchema);

export { Movie, IMovie };