import { Schema, model } from "mongoose";

const cartsColl='carts'
const cartsSchema = new Schema({
    id: Number,
    products: Array
});

export const cartModel=model(cartsColl, cartsSchema)
