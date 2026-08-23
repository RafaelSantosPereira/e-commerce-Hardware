const orderService = require('./order.service');

// Cria uma encomenda para o utilizador autenticado.
async function create(req, res) {
  try {
    const orderId = await orderService.create(req.user.id, req.body);
    res.status(201).json({ message: 'Compra finalizada com sucesso!', orderId });
  } catch (error) {
    console.error('Erro ao inserir pedido:', error);
    res.status(error.status || 500).json({ error: error.status ? error.message : 'Erro ao criar pedido.' });
  }
}

// Lista o histórico de encomendas do utilizador autenticado.
async function getByUser(req, res) {
  try {
    res.json(await orderService.getByUser(req.user.id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar pedidos' });
  }
}

module.exports = { create, getByUser };
