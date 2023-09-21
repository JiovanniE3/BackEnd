import { Schema, model } from "mongoose";

const productsColl='products'
const productsSchema = new Schema({
    id: Number,
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    thumbnail: String,
    stock: Number,
    category: String
}, { strict: true });

export const productsModel=model(productsColl, productsSchema)