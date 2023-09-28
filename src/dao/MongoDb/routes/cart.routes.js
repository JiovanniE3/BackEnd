import { Router } from "express";
import __dirname from '../../../utils.js';
import { cartModel } from '../models/cart.model.js';
import { productsModel } from "../models/products.model.js";

const router=Router()


router.post('/', async (req, res) => {

    const lastProduct = await cartModel.findOne({}, {}, { sort: { id: -1 } });
    const lastId = lastProduct ? lastProduct.id : 0;
    const nextId = lastId + 1;
   
    
    try {
        let newCart = await cartModel.create({
            id: nextId,
            products: []
        })

        await newCart.save();


        res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });

    } catch (error) {
        res.status(500).json({ error: 'error inesperado', detalle: error.message })
    }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartModel
      .findOne({ id: parseInt(req.params.cid) })
      .populate('products.product'); 

    if (!cart) {
      
      return res.status(404).json({ error: 'Carrito no encontrado' });
      
    }

    res.status(200).json({ message: 'Carrito encontrado', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
});


router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartModel.findOne({ id: parseInt(cid) });
    const product = await productsModel.findOne({ id: parseInt(pid) });

    if (!cart || !product) {
      return res.status(404).json({ error: 'Carrito o producto no encontrado' });
    }

    const existingProduct = cart.products.find(item => item.product.toString() === product._id.toString());

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: product._id, quantity: 1 });
    }

    await cart.save();

    const newCart = await cartModel.findOne({ id: parseInt(cid) });

    res.status(200).json({ message: 'Producto agregado al carrito con éxito', newCart });
  } catch (error) {
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
});

  




router.delete('/:cid/products/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;

      const cart = await cartModel.findOne({ id: parseInt(cid) });

      if (!cart) {
          return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      cart.products = cart.products.filter(product => product.product !== parseInt(pid));

      await cart.save();

      res.status(200).json({ message: 'Producto eliminado del carrito con éxito', cart });
  } catch (error) {
      res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
});


router.put('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const { products } = req.body;

      const cart = await cartModel.findOne({ id: parseInt(cid) });

      if (!cart) {
          return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      cart.products = products;

      await cart.save();

      res.status(200).json({ message: 'Carrito actualizado con éxito', cart });
  } catch (error) {
      res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
});


router.put('/:cid/products/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      const cart = await cartModel.findOne({ id: parseInt(cid) });

      if (!cart) {
          return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      const productToUpdate = cart.products.find(product => product.product === parseInt(pid));

      if (!productToUpdate) {
          return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      }

      productToUpdate.quantity = quantity;

      await cart.save();

      res.status(200).json({ message: 'Cantidad de producto actualizada con éxito', cart });
  } catch (error) {
      res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
});


router.delete('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;

      const cart = await cartModel.findOne({ id: parseInt(cid) });

      if (!cart) {
          return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      cart.products = [];

      await cart.save();

      res.status(200).json({ message: 'Todos los productos del carrito han sido eliminados', cart });
  } catch (error) {
      res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
});

// ...




export default router;


