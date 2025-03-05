import mongoose, { Schema, Document } from 'mongoose';

// Interface para o modelo User
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  likedMovies: mongoose.Types.ObjectId[];
}

// Definindo o schema para o usuário
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
}, { timestamps: true });

// Criando o modelo User com base no schema
const User = mongoose.model<IUser>('User', userSchema);

export { User, IUser };
