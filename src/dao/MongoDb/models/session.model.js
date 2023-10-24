import { Schema, model } from "mongoose";
import mongoose from 'mongoose'

export const usersModel=mongoose.model('usersData', new mongoose.Schema({
    name: String,
    email: {
        type: String, unique: true
    },
    password: String,
    cart: { type: Schema.Types.ObjectId, ref: 'carts' },
    github: {},
    role: String
}))