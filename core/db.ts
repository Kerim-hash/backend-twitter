import mongoose, { ConnectOptions } from "mongoose";


mongoose.Promise = Promise

mongoose
    .connect(`mongodb+srv://kerim:uvyfZIRGWnJvZHJq@cluster0.iwqrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
        useNewUrlParser: true, useUnifiedTopology: true 
    } as ConnectOptions)
    .then((res) => console.log("Connected to DB"))
    .catch((error) => console.log('connection error'));

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error"));
export { mongoose, db }