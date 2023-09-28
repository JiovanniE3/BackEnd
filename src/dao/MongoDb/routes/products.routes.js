import { Router } from 'express';
import __dirname from '../../../utils.js';
import { serverSocket } from "../../../app.js";
import { productsModel } from '../models/products.model.js';


const router = Router();



router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
        page: parseInt(page), // Número de página
        limit: parseInt(limit), // Cantidad de resultados por página
    };

    // Opciones de ordenamiento
    if (sort) {
        const sortOrder = sort === 'asc' ? 1 : sort === 'desc' ? -1 : 0;
        if (sortOrder !== 0) {
            options.sort = { price: sortOrder };
        }
    }

    // Opciones de filtro
    const filter = query ? { category: query } : {};

    try {
        const products = await productsModel.paginate(filter, options); // Realiza la consulta con paginación
        
        const responseData = {
            products: products.docs, // Lista de productos en la página actual
            totalPages: products.totalPages, // Total de páginas
            hasPrevPage: products.hasPrevPage, // Indica si hay una página anterior
            hasNextPage: products.hasNextPage, // Indica si hay una página siguiente
            prevPage: products.prevPage, // Número de página anterior
            nextPage: products.nextPage, // Número de página siguiente
        };
        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar productos.' });
    }
    
});



router.get('/:pid', async (req, res) => {

    let products = await productsModel.findOne( {id: req.params.pid} )

    res.json(products);

});

router.post('/', async (req, res) => {


    let products = await productsModel.find()
    const lastProduct = await productsModel.findOne({}, {}, { sort: { id: -1 } });
    const lastId = lastProduct ? lastProduct.id : 0;
    const nextId = lastId + 1;

    const {
        title,
        description,
        code,
        price,
        thumbnail,
        stock,
        category
    } = req.body;


    try {
        let newProduct = await productsModel.create({
            id: nextId,
            title,
            description,
            code,
            price,
            status: true,
            thumbnail,
            stock,
            category
        })

        await newProduct.save();

        let products = await productsModel.find()

        serverSocket.emit('newProduct', newProduct, products);

        res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });

    } catch (error) {
        res.status(500).json({ error: 'error inesperado', detalle: error.message })
    }

});

router.put('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);


        const productToUpdate = await productsModel.findOne({ id: productId });

        if (!productToUpdate) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const {
            title,
            description,
            code,
            price,
            thumbnail,
            stock,
            category
        } = req.body;

        productToUpdate.title = title;
        productToUpdate.description = description;
        productToUpdate.code = code;
        productToUpdate.price = price;
        productToUpdate.thumbnail = thumbnail;
        productToUpdate.stock = stock;
        productToUpdate.category = category;

        await productToUpdate.save();

        res.status(200).json({ message: 'Producto modificado con éxito', product: productToUpdate });
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {

        
        const productId = parseInt(req.params.id);

        const productToDelete = await productsModel.findOneAndRemove({ id: productId });

        if (!productToDelete) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        let products = await productsModel.find()

        serverSocket.emit('productDeleted', { productId, products });

        res.status(200).json({ message: 'Producto eliminado con éxito', product: productToDelete });

    } catch (error) {

        res.status(500).json({ error: 'Error inesperado', detalle: error.message });

    }
});



export default router;