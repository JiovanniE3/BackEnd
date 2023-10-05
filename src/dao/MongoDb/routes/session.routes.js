import { Router } from 'express';
import crypto from 'crypto'
import { usersModel } from '../models/session.model.js';
const router=Router()

router.post('/signup',async(req,res)=>{

    let {name, email, password}=req.body

    if(!name || !email || !password){
        return res.status(400).send('Data incomplete')
    }

    let existe=await usersModel.findOne({email})
    if(existe){
        return res.status(400).send(`User already exist: ${email}`)
    }

    password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

    await usersModel.create({
        name, email, password
    })

    res.redirect(`/login?newUser=${email}`)
})

router.post('/login',async(req,res)=>{

    let {email, password}=req.body

    if(!email || !password) {
        return res.send('Data incomplete')
    }

    password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

    let users=await usersModel.findOne({email, password})

    if(!users){
        return res.status(401).send('Email or password incorrect')
    }

    if (users.email === "adminCoder@coder.com"){
        req.session.user={
            name: users.name,
            email: users.email,
            rol: "admin"
        }
    }
    else{

        req.session.user={
            name: users.name,
            email: users.email,
            rol: "user"
        }
    }

    
    res.redirect('/products')

    
});


router.get('/logout',(req,res)=>{

    req.session.destroy(e=>console.log(e))

    res.redirect('/login?msg=logout')

});

export default router;