import { model, Schema, Document } from "mongoose";
import { UserModelInterface } from "./UserModel";

export interface TweetModelInterface {
    _id?: string;
    text: string;
    user: UserModelInterface;
    images: string[];
    likes: string[],
    liked: boolean
}

export type TweetModelDocumentInterface = TweetModelInterface & Document


const TweetSchema = new Schema<TweetModelInterface>({
    text: { required: true, type: String, maxlength: 280},
    images: [{type: String}],
    user: { required: true, type: Schema.Types.ObjectId, ref: "User" },
    likes: [{type: String}],
    liked: {required: true, default: false, type: Boolean}
}, {
    timestamps : true
});



export const TweetModel = model<TweetModelInterface>("Tweet", TweetSchema);
 