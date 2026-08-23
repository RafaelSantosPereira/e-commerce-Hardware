const cartService = require('./cart.service');

// Adiciona um item ao carrinho autenticado.
async function add(req, res) {
  try {
    await cartService.add(req.user.id, req.body.productId, req.body.quantity);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar ao carrinho' });
  }
}

// Devolve o carrinho do utilizador autenticado.
async function get(req, res) {
  try {
    res.json(await cartService.get(req.user.id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar carrinho' });
  }
}

// Procura os dados dos itens guardados localmente.
async function getItems(req, res) {
  try {
    res.json(await cartService.getItems(req.body.ids));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
}

// Sincroniza um carrinho local com o carrinho autenticado.
async function merge(req, res) {
  try {
    await cartService.merge(req.user.id, req.body.items);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao sincronizar carrinho' });
  }
}

// Remove um produto específico.
async function remove(req, res) {
  try {
    await cartService.remove(req.user.id, req.params.itemId);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover item do carrinho' });
  }
}

// Esvazia o carrinho autenticado.
async function clear(req, res) {
  try {
    await cartService.clear(req.user.id);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover item do carrinho' });
  }
}
module.exports = { add, get, getItems, merge, remove, clear };
