import { Router } from "express";
import __dirname from '../../../utils.js';
import { cartModel } from '../models/cart.model.js';

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

    let products = await cartModel.findOne( {id: req.params.cid} )

    res.json(products);

});



router.post('/:cid/product/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params; 
      

      const cart = await cartModel.findOne({ id: parseInt(cid) });
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  

      const existingProduct = cart.products.find(product => product.product === parseInt(pid));
  
      if (existingProduct) {

        await cartModel.updateOne(
            { id: parseInt(cid), 'products.product': parseInt(pid) },
            { $inc: { 'products.$.quantity': 1 } }
          );
      } else {

        cart.products.push({
          product: parseInt(pid),
          quantity: 1,
        });
      }
  
      await cart.save();

      const newCart = await cartModel.findOne({ id: parseInt(cid) });
  
      res.status(200).json({ message: 'Producto agregado al carrito con éxito', newCart });
    } catch (error) {
      res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
  });
  



export default router;


