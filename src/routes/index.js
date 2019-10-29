const express = require('express');
const path = require('path');
const ProductService = require('../services');
const receipt = '../assets/receipt.pdf'

const platziStore = (app) => {
  const router = express.Router();
  app.use('/api/products/', router);

  const productService = new ProductService();

  // router.get('/', (req, res) => {
  //   res.send(`API v2`);
  // });

  router.get('/receipts', (req, res, next) => {
    let file = path.join(__dirname, receipt);
    res.sendFile(file);
  });

  router.get('/', async (req, res, next) => {
    try {
      const storeProducts = await productService.getProducts()

      res.status(200).json({
        data: storeProducts,
        message: "products listed"});
    } catch(err) {
      next(err)
    }
    
  });

  router.get('/:productId', async (req, res, next) => {
    const { productId } = req.params;
    try {
      const product = await productService.getProduct({ productId });

      res.status(200).json({
        data: product,
        message: 'product retrieved'
      });
    } catch(err) {
      next(err)
    }
  })

  router.post('/', async (req, res, next) => {
    const { body: product } = req;
    try {
      const createProductId = await productService.createProduct({ product })


      res.status(201).json({
        data: createProductId,
        message: 'product created'
      });
    } catch(err) {
      //res.status(400)
      //console.log(err);
      next(err)
    }
  })

  router.put("/:productId", async (req, res, next) => {
    const { productId } = req.params;
    const { body: product } = req;
    try {
      const updatedProductId = await productService.updateProduct({ productId, product })

      res.status(200).json({
        data: updatedProductId,
        message: 'product updated'
      });
    } catch(err) {
      next(err)
    }
  });

  router.delete("/:productId", async (req, res, next) => {
    const { productId } = req.params;

    try {
      const deleteProductId = await productService.deleteProduct({ productId });

      res.status(200).json({
        data: deleteProductId,
        message: 'product deleted'
      })
    } catch(err) {
      next(err);
    }
  });

  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });
}

module.exports = platziStore;