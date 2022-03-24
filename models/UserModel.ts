import { model, Schema, Document } from "mongoose";

export interface UserModelInterface {
  _id?: string;
  email: string;
  fullname: string;
  username: string;
  password: string;
  confirm_hash: string;
  confirmed?: boolean;
  location?: string;
  website?: string;
  about?: string;
  tweets?: string[]
}

export type UserModelDocumentInterface = UserModelInterface & Document


const UserSchema = new Schema<UserModelInterface>({
  fullname: String,
  email: { type: String, unique: true, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true, },
  confirm_hash: { type: String, require: true },
  confirmed: { type: Boolean, default: false, },
  about: String,
  location: String,
  website: String,
  tweets: [{ type: Schema.Types.ObjectId, ref: "Tweet"}],
},
  { timestamps: true }
 );

UserSchema.set('toJSON', {
  transform: function (_, obj,) {
    delete obj.password;
    delete obj.confirm_hash;
    return obj;
  }
})


export const UserModel = model<UserModelInterface>("User", UserSchema);
