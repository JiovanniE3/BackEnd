import { Router } from "express";
import __dirname from '../../../utils.js';

const router=Router()

const auth=(req, res, next)=>{
    if(req.session.user){
        next()
    }else{
        return res.redirect('/login')
    }
}

const auth2=(req, res, next)=>{
    if(req.session.user){
        console.log('auth2 me manda a perfil')

        return res.redirect('/products')
    }else{
        next()
    }
}


router.get('/',auth,(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('home');
})

router.get('/realTimeProducts',auth,(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('realTimeProducts');
})

router.get('/chat',auth,(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('chat');
})



router.get('/products',auth, (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('products');
});

router.get('/products/:id',auth, (req, res) => {
    const productId = req.params.id;
    res.setHeader('Content-Type', 'text/html');
    res.render('productDetail', { productId });
});

router.get('/carts/:id',auth, (req, res) => {
    const cartId = req.params.id;
    res.setHeader('Content-Type', 'text/html');
    res.render('cartDetail', { cartId });
});


router.get('/signup',auth2,(req,res)=>{

    res.status(200).render('signup')
})

router.get('/login',auth2,(req,res)=>{

    res.status(200).render('login')
})




export default router;