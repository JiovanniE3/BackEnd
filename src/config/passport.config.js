import passport from 'passport'
import local from 'passport-local'
import github from 'passport-github2'
import { usersModel } from '../dao/MongoDb/models/session.model.js'
import { cartModel } from '../dao/MongoDb/models/cart.model.js';
import { generaHash } from '../utils.js'
import { validaHash } from '../utils.js'

export const inicializaPassport = () => {


    passport.use('github', new github.Strategy(
        {
            clientID: 'Iv1.f2cef403314efc68',
            clientSecret: '9aef9896dc5748104d487f698063a132144b50fe',
            callbackURL: 'http://localhost:8080/api/session/callbackGithub'
        },
        async (token, tokenRefresh, profile, done) => {
            try {
                console.log(profile);
                let usuario = await usersModel.findOne({ email: profile._json.login });

                if (!usuario) {
                    const cartResponse = await fetch('http://localhost:8080/api/carts/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!cartResponse.ok) {
                        throw new Error(`Failed to create a cart: ${cartResponse.status}`);
                    }
                    const cartData = await cartResponse.json();
                    const cartId = cartData.cart._id;

                    usuario = await usersModel.create({
                        name: profile._json.login,
                        email: profile._json.login,
                        cart: cartId,
                        github: profile,
                        role: "user",
                    });
                }

                const idcart = await cartModel.findOne({ _id: usuario.cart });


                usuario = {
                    name: usuario.name,
                    email: usuario.email,
                    cart: idcart.id,
                    _id: usuario._id,
                    rol: usuario.role
                };


                done(null, usuario);

            } catch (error) {
                return done(error);
            }
        }
    ));


    passport.use('signup', new local.Strategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                let { name, email, password } = req.body;

                if (!name || !email || !password) {
                    done(null, false);
                }

                let existe = await usersModel.findOne({ email });
                if (existe) {
                    done(null, false);
                }

                let role = "user";


                if (email === "adminCoder@coder.com") {

                    role = "admin";

                }


                const cartResponse = await fetch('http://localhost:8080/api/carts/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!cartResponse.ok) {
                    throw new Error(`Failed to create a cart: ${cartResponse.status}`);
                }
                const cartData = await cartResponse.json();
                console.log(cartData);
                const cartId = cartData.cart._id;
                

                let usuario = await usersModel.create({
                    name,
                    email,
                    password: generaHash(password),
                    cart: cartId,
                    role: role
                });


                console.log(usuario);
                console.log('Pasando por passport registro...!!!');

                done(null, usuario);
            } catch (error) {
                done(error);
            }
        }
    ));

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

                const idcart = await cartModel.findOne({ _id: usuario.cart });

                    usuario = {
                        name: usuario.name,
                        email: usuario.email,
                        cart: idcart.id,
                        _id: usuario._id,
                        rol: usuario.role
                    };


                console.log(usuario);

                done(null, usuario);

            } catch (error) {
                done(error);
            }
        }
    ));

    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id)
    })

    passport.deserializeUser(async (id, done) => {
        let usuario = await usersModel.findById(id)
        return done(null, usuario)
    })

} 