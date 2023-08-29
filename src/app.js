const express = require('express');
const productRouter=require('./routes/products.routes')
const cartRouter=require('./routes/cart.routes')

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products/',productRouter)
app.use('/api/carts/',cartRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
