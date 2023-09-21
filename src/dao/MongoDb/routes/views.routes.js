import { Router } from "express";

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

export default router;