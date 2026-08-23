const express = require('express');
const orderController = require('./order.controller');
const authenticateToken = require('../../middleware/auth.middleware');

const router = express.Router();

// Todas as operações de encomendas exigem autenticação.
router.post('/order', authenticateToken, orderController.create);
router.get('/orders', authenticateToken, orderController.getByUser);

module.exports = router;
