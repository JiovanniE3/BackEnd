import express from 'express';
import path from 'path';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import { router as viewRouter } from './routes/views.routes.js';
import {Server} from 'socket.io';
import {engine} from 'express-handlebars';
import __dirname from './utils.js';


const PORT = 8080;
const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

console.log(path.join(__dirname,'/views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')));
console.log(path.join(__dirname,'/public'));

app.use('/api/products/', productRouter);
app.use('/api/carts/', cartRouter);
app.use('/', viewRouter);


const serverExpress=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const serverSocket=new Server(serverExpress)

serverSocket.on('connection',socket=>{
    console.log(`Se ha conectado un cliente con id ${socket.id}`)
})

export { serverSocket };