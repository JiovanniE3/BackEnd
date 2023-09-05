import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import __dirname from '../utils.js';

const router = Router();
const rutaProduct = path.join(__dirname,'files', 'products.json');
const rutaCarts = path.join(__dirname,'files', 'carts.json');


function getProducts() {
    if (fs.existsSync(rutaProduct)) {
        return JSON.parse(fs.readFileSync(rutaProduct, 'utf-8'));
    } else {
        return [];
    }
}

function getCarts() {
    if (fs.existsSync(rutaCarts)) {
        return JSON.parse(fs.readFileSync(rutaCarts, 'utf-8'));
    } else {
        return [];
    }
}

function saveCarts(carts) {
    fs.writeFileSync(rutaCarts, JSON.stringify(carts, null, 5));
}

router.post('/', (req, res) => {
    let carts = getCarts();

    const newCart = {
        id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
        products: []
    };

    carts.push(newCart);
    saveCarts(carts);

    res.status(201).json({ newCart });
});

router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const carts = getCarts();

    const cart = carts.find(cart => cart.id === cartId);

    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;

    const products = getProducts();
    const carts = getCarts();

    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    const product = products.find(product => product.id === productId);

    if (cartIndex !== -1 && product) {
        const cart = carts[cartIndex];
        const existingProduct = cart.products.find(item => item.product === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity || 1;
        } else {
            cart.products.push({ product: productId, quantity: quantity || 1 });
        }

        saveCarts(carts);
        res.status(200).json({ updatedCart: cart });
    } else {
        res.status(404).json({ error: 'Cart or product not found' });
    }
});

export default router;
