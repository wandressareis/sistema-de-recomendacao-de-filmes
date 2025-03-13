import mongoose, { Schema, Document } from "mongoose";

interface ILike extends Document {
    user_id: string;
    movie_id: number;
    genres: number[]; // Lista de IDs de gêneros
}

const likeSchema = new Schema<ILike>({
    user_id: { type: String, required: true },
    movie_id: { type: Number, required: true },
    genres: { type: [Number], required: true } // Adiciona os gêneros do filme
}, { timestamps: true });

const Like = mongoose.model<ILike>('Like', likeSchema);

export { Like, ILike };