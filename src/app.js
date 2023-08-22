const express = require('express');
const productsData = require('./files/products');

const PORT = 3000;
const app = express();

app.get('/products', (req, res) => {
    const { limit } = req.query;
    let productsToSend = productsData;

    console.log(productsData);

    if (limit) {
        const limitValue = parseInt(limit);
        if (!isNaN(limitValue)) {
            productsToSend = productsData.slice(0, limitValue);
        }
    }

    res.json(productsToSend);
});

app.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    console.log(typeof productId)
    const product = productsData.find(product => product.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
