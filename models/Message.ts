import { model, Schema, Document } from "mongoose";

export interface MessageModelInterface {
   conversationId: string,
    sender: string,
    text: string,
}

export type MessageModelDocumentInterface = MessageModelInterface & Document

const MessageSchema = new Schema<MessageModelInterface>({
    conversationId: {type: String},
    sender: {type: String},
    text: {type: String}
}, {
    timestamps : true
});



export const MessageModel = model<MessageModelInterface>("Message", MessageSchema);
 