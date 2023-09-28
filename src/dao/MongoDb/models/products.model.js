import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

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

productsSchema.plugin(mongoosePaginate)

export const productsModel=model(productsColl, productsSchema)