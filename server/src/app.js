const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./modules/products/product.routes');
const authRoutes = require('./modules/auth/auth.routes');
const cartRoutes = require('./modules/cart/cart.routes');
const orderRoutes = require('./modules/orders/order.routes');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Middleware global da aplicação.
app.use(cors({
  origin: isProduction ? process.env.FRONTEND_URL : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Endpoint de verificação rápida do estado da API.
app.get('/', (req, res) => {
  res.send(`API online em modo ${isProduction ? 'Produção' : 'Desenvolvimento'}`);
});

// Rotas organizadas por domínio funcional.
app.use('/products', productRoutes);
app.use('/', authRoutes);
app.use('/', cartRoutes);
app.use('/', orderRoutes);

module.exports = app;
