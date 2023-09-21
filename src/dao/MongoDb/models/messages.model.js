import { Schema, model } from "mongoose";

const messageColl='message'
const messageSchema = new Schema({
    user: String,
    message: String,
}, { strict: true });

export const messageModel=model(messageColl, messageSchema)