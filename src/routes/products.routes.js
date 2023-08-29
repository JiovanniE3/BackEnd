const Router = require('express').Router;
const router = Router();

const path = require('path');
const fs = require('fs');

const ruta = path.join(__dirname, '..', 'files', 'products.json');

function getProducts() {
    if (fs.existsSync(ruta)) {
        return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
    } else {
        return [];
    }
}

function saveProducts(products) {
    fs.writeFileSync(ruta, JSON.stringify(products, null, 5));
}

router.get('/', (req, res) => {
    let products = getProducts();

    const { limit } = req.query;

    if (limit) {
        const limitValue = parseInt(limit);
        if (!isNaN(limitValue)) {
            products = products.slice(0, limitValue);
        }
    }

    res.json(products);
});

router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const products = getProducts();

    const product = products.find(product => product.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

router.post('/', (req, res) => {
    const { title, description, code, price,  thumbnail, stock, category } = req.body;

    if (!title || !description || !code || !price || !thumbnail || !stock || !category) {
        return res.status(400).json({ error: 'Complete all required fields in the body' });
    }

    const products = getProducts();

    const newProduct = {
        title,
        description,
        code,
        price,
        status:true,
        thumbnail,
        stock,
        category,
        id:products.length > 0 ? products[products.length - 1].id + 1 : 1,
    };

    products.push(newProduct);

    saveProducts(products);

    res.status(201).json({ newProduct });
});

router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const { title, description, code, price, stock, category, thumbnail } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Complete all required fields in the body' });
    }

    const products = getProducts();
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
    
        const originalThumbnail = products[productIndex].thumbnail;

        products[productIndex] = {
            title,
            description,
            code,
            price,
            status: true,
            thumbnail: thumbnail || originalThumbnail, 
            stock,
            category,
            id: productId,
        };

        saveProducts(products);
        res.status(200).json({ updatedProduct: products[productIndex] });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});


router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const products = getProducts();
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1);
        saveProducts(products);
        res.status(200).json({ deletedProduct: deletedProduct[0] });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

module.exports = router;
