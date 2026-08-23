const express = require('express');
const authController = require('./auth.controller');

const router = express.Router();

// Rotas públicas de autenticação e confirmação de conta.
router.post('/register', authController.register);
router.get('/verify/:token', authController.verify);
router.post('/resend-verification', authController.resendVerification);
router.post('/login', authController.login);

module.exports = router;
