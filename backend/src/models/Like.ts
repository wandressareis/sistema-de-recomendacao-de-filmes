import mongoose, { Schema, Document } from "mongoose";

interface ILike extends Document {
    user_id: string;
    movie_id: number;
}

const likeSchema = new Schema<ILike>({
    user_id: { type: String, required: true },
    movie_id: { type: Number, required: true }
}, { timestamps: true });

const Like = mongoose.model<ILike>('Like', likeSchema);

export { Like, ILike };