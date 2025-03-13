// backend/src/models/MyList.ts
import mongoose, { Document, Schema } from "mongoose";

export interface MyListDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  movie_id: number;
}

const MyListSchema = new Schema<MyListDocument>({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  movie_id: { type: Number, required: true },
});

export const MyList = mongoose.model<MyListDocument>("MyList", MyListSchema);
