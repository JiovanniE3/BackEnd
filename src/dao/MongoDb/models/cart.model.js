import { Schema, model } from "mongoose";

const cartsColl = 'carts';

const cartsSchema = new Schema({
    id: Number,
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'products' },
            quantity: Number,
        },
    ],
});

export const cartModel = model(cartsColl, cartsSchema);
