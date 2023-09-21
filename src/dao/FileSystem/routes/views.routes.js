import { Router } from "express";
//export const router=Router()

router.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('home');
})

router.get('/realTimeProducts',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('realTimeProducts');
})