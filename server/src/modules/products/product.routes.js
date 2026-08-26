const express = require('express');
const productController = require('./product.controller');

const router = express.Router();

// A rota /search vem antes das rotas dinâmicas para evitar ambiguidades.
router.get('/', productController.getAll);
router.get('/category/id/:categoryId/filters', productController.getCategoryFilters);
router.get('/category/id/:categoryId', productController.getByCategory);
router.get('/search', productController.search);
router.get('/:id/details', productController.getDetails);

module.exports = router;
