import { model, Schema, Document } from "mongoose";
import { UserModelInterface } from "./UserModel";
export interface TweetCommentModelInterface {
    text?: string;
    images?: string[];
    TweetID: string,
    // user: UserModelInterface,
    username: string,
    fullname: string
}
export type TweetContentModelDocumentInterface = TweetCommentModelInterface & Document

const TweetCommentSchema = new Schema ({
    text:String,
    images: [{type: String}],
    TweetID: {type: Schema.Types.ObjectId, ref: "Tweet"},
    username: {type: String},
    fullname: {type: String}
},{
    timestamps : true
});

export const TweetCommentModel  = model('Comment', TweetCommentSchema)