const productService = require('./product.service');

// Lista o catálogo completo.
async function getAll(req, res) {
  try {
    res.json(await productService.getAll());
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}

// Lista os produtos de uma categoria.
async function getByCategory(req, res) {
  try {
    res.json(await productService.getByCategory(req.params.categoryId));
  } catch (error) {
    console.error('Erro ao buscar produtos por category_id:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos por category_id' });
  }
}

// Devolve os detalhes de um produto.
async function getDetails(req, res) {
  try {
    const result = await productService.getDetails(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar detalhes do produto:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do produto' });
  }
}

// Executa a pesquisa do catálogo.
async function search(req, res) {
  try {
    res.json(await productService.search(req.query.searchQuery));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
}

module.exports = { getAll, getByCategory, getDetails, search };
