import express from 'express';
import path from 'path';
import productsRouter from './dao/MongoDb/routes/products.routes.js';
import viewRouter from './dao/MongoDb/routes/views.routes.js';
import cartRouter from './dao/MongoDb/routes/cart.routes.js';
import messageRoute from './dao/MongoDb/routes/messages.routes.js';
import sessionRoute from './dao/MongoDb/routes/session.routes.js';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import session from 'express-session';
import ConnectMongo from 'connect-mongo'
import passport from 'passport';
import { inicializaPassport } from './config/passport.config.js';



const PORT = 8080;
const app = express();

app.engine('handlebars', engine({ allowProtoMethodsByDefault: true, }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

console.log(path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: 'claveSecreta',
    resave: true, saveUninitialized: true,
    store: ConnectMongo.create({
        mongoUrl: 'mongodb+srv://kingsmandb:QRvjevz0kJ0XVNXE@cluster0.xbv6krb.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce',
        ttl: 3600
    })
}))

app.use(function sessionMiddleware(req, res, next) {
    res.locals.user = req.session.user || null;
    next();
})

inicializaPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, '/public')));

console.log(path.join(__dirname, '/public'));

app.use('/api/products/', productsRouter);
app.use('/api/messages/', messageRoute); //
app.use('/api/carts/', cartRouter); //
app.use('/', viewRouter); //
app.use('/api/session/', sessionRoute); //



const serverExpress = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

const serverSocket = new Server(serverExpress)

serverSocket.on('connection', socket => {
    console.log(`Se ha conectado un cliente con id ${socket.id}`)
})

try {
    await mongoose.connect('mongodb+srv://kingsmandb:QRvjevz0kJ0XVNXE@cluster0.xbv6krb.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce')
    console.log('DB online')
} catch (error) {
    console.log(error.message)
}

export { serverSocket };