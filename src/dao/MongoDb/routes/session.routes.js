import { Router } from 'express';
import passport from 'passport';

const router=Router()

router.post('/signup',passport.authenticate('signup',{}),(req,res)=>{
   
    res.redirect('/login')
})

router.post('/login',passport.authenticate('login',{}),(req,res)=>{

    req.session.user=req.user

    res.redirect('/products')
})


router.get('/logout',(req,res)=>{

    req.session.destroy(e=>console.log(e))

    res.redirect('/login?msg=logout')

});

router.get('/github', passport.authenticate('github',{}),(req,res)=>{})

router.get('/callbackGithub',passport.authenticate('github',{failureRedirect:'/api/sessionsPassport/errorGithub'}),(req,res)=>{

    console.log(req.user);
    
    req.session.user=req.user

    res.redirect('/products')
});

router.get('/errorGithub',(req,res)=>{
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        error:'Error en Github'
    });
});



export default router;