import { model, Schema, Document } from "mongoose";

export interface ConversationModelInterface {
   members: string[]
}

export type ConversationModelDocumentInterface = ConversationModelInterface & Document

const ConversationSchema = new Schema<ConversationModelInterface>({
    members: [{type: String}]
}, {
    timestamps : true
});



export const ConversationModel = model<ConversationModelInterface>("Conversation", ConversationSchema);
 