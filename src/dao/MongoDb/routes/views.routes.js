import { Router } from "express";
import __dirname from '../../../utils.js';

const router=Router()

router.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('home');
})

router.get('/realTimeProducts',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('realTimeProducts');
})

router.get('/chat',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('chat');
})

router.get('/products', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('products');
});

router.get('/products', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('products');
});

router.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    res.setHeader('Content-Type', 'text/html');
    res.render('productDetail', { productId });
});

router.get('/carts/:id', (req, res) => {
    const cartId = req.params.id;
    res.setHeader('Content-Type', 'text/html');
    res.render('cartDetail', { cartId });
});



export default router;