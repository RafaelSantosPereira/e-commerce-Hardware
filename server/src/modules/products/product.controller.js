const productService = require('./product.service');

// Lista o catálogo completo.
async function getAll(req, res) {
  try {
    res.json(await productService.getAll(req.query.limit, req.query.offset));
  } catch (error) {
    console.error('Erro na query:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}

// Lista os produtos de uma categoria.
async function getByCategory(req, res) {
  try {
    const brands = req.query.brands
      ? req.query.brands.split(',').filter(Boolean)
      : [];
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);
    const products = await productService.getByCategory(
      req.params.categoryId,
      req.query.limit,
      req.query.offset,
      {
        brands,
        minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
        maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
        sort: req.query.sort,
      }
    );
    const options = await productService.getCategoryFilterOptions(req.params.categoryId);
    res.json({ ...products, ...options });
  } catch (error) {
    console.error('Erro ao buscar produtos por category_id:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos por category_id' });
  }
}

async function getCategoryFilters(req, res) {
  try {
    res.json(await productService.getCategoryFilterOptions(req.params.categoryId));
  } catch (error) {
    console.error('Erro ao buscar filtros da categoria:', error);
    res.status(500).json({ error: 'Erro ao buscar filtros da categoria' });
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
    res.json(await productService.search(
      req.query.searchQuery,
      req.query.limit,
      req.query.offset
    ));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
}

module.exports = { getAll, getByCategory, getCategoryFilters, getDetails, search };
