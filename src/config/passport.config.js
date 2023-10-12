import passport from 'passport'
import local from 'passport-local'
import github from 'passport-github2'
import { usersModel } from '../dao/MongoDb/models/session.model.js'
import { generaHash } from '../utils.js'
import { validaHash } from '../utils.js'

export const inicializaPassport=()=>{

    
    passport.use('github', new github.Strategy(
        {
            clientID: 'Iv1.f2cef403314efc68', 
            clientSecret: '9aef9896dc5748104d487f698063a132144b50fe',
            callbackURL: 'http://localhost:8080/api/session/callbackGithub'
        },
        async(token, tokenRefresh, profile, done)=>{
            try {
                console.log(profile)
                let usuario=await usersModel.findOne({email:profile._json.login})
                if(!usuario){
                    usuario=await usersModel.create({
                        name: profile._json.login,
                        email: profile._json.login,
                        github: profile
                    })
                }

                usuario = {
                    name: profile._json.login,
                    email: profile._json.login,
                    _id: usuario._id,
                    rol: "user"
                };

                done(null, usuario)


            } catch (error) {
                return done(error)
            }
        }
    ))




    passport.use('signup', new local.Strategy(
        {
            usernameField:'email', passReqToCallback:true
        },
        async(req, username, password, done)=>{
            try {

              
                let {name, email, password}=req.body

                if(!name || !email || !password){

                    done(null, false)
                }
            
                let existe=await usersModel.findOne({email})
                if(existe){

                    done(null, false)
                }
            
            
                let usuario=await usersModel.create({
                    name, email, 
                    password: generaHash(password)
                })

                console.log('pasando x passport registro...!!!')

                done(null, usuario)
            
            } catch (error) {
                done(error)
            }
        }
    ))


    passport.use('login', new local.Strategy(
        {
            usernameField: 'email',
        },
        async (username, password, done) => {
            try {
                if (!username || !password) {
                    return done(null, false);
                }
    
                let usuario = await usersModel.findOne({ email: username });
                if (!usuario) {
                    return done(null, false);
                } else {
                    if (!validaHash(usuario, password)) {
                        return done(null, false);
                    }
                }

                if (usuario.email === "adminCoder@coder.com") {
                    usuario = {
                        name: usuario.name,
                        email: usuario.email,
                        _id: usuario._id,
                        rol: "admin"
                    };
                } else {
                    usuario = {
                        name: usuario.name,
                        email: usuario.email,
                        _id: usuario._id,
                        rol: "user"
                    };
                }
    
                done(null, usuario);
    
            } catch (error) {
                done(error);
            }
        }
    ));
    
    passport.serializeUser((usuario, done)=>{
        return done(null, usuario._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let usuario=await usersModel.findById(id)
        return done(null, usuario)
    })

} 