const express = require('express');
const cartController = require('./cart.controller');
const authenticateToken = require('../../middleware/auth.middleware');

const router = express.Router();

// Operações protegidas do carrinho.
router.post('/cart', authenticateToken, cartController.add);
router.get('/getcart', authenticateToken, cartController.get);

// Dados de produtos usados pelo carrinho local.
router.post('/getItems', cartController.getItems);
router.post('/cart/merge', authenticateToken, cartController.merge);
router.delete('/cart/:itemId', authenticateToken, cartController.remove);
router.delete('/cart', authenticateToken, cartController.clear);

module.exports = router;
