const pool = require('../../config/db');

// Obtém todos os produtos do catálogo.
async function getAll(limit = 20, offset = 0) {
  const pagination = parsePagination(limit, offset);
  const result = await pool.query(
    'SELECT * FROM product LIMIT $1 OFFSET $2',
    [pagination.limit, pagination.offset]
  );
  return result.rows;
}

// Obtém os produtos pertencentes a uma categoria.
async function getByCategory(categoryId, limit = 20, offset = 0, filterOptions = {}) {
  const pagination = parsePagination(limit, offset);
  const filters = buildCategoryFilters(categoryId, filterOptions);
  const result = await pool.query(
    `SELECT *, COUNT(*) OVER()::int AS total_count
     FROM product
     WHERE ${filters.where}
     ${buildOrderBy(filters.sort)}
     LIMIT $${filters.values.length + 1} OFFSET $${filters.values.length + 2}`,
    [...filters.values, pagination.limit, pagination.offset]
  );
  const total = result.rows[0]?.total_count || 0;
  return {
    products: result.rows.map(({ total_count, ...product }) => product),
    total,
  };
}

async function getCategoryFilterOptions(categoryId) {
  const result = await pool.query(
    `SELECT ARRAY_AGG(DISTINCT brand ORDER BY brand) FILTER (WHERE brand IS NOT NULL) AS brands,
            MIN(price) AS min_price,
            MAX(price) AS max_price
     FROM product
     WHERE category_id = $1`,
    [categoryId]
  );
  return {
    brands: result.rows[0].brands || [],
    minPrice: Number(result.rows[0].min_price) || 0,
    maxPrice: Number(result.rows[0].max_price) || 0,
  };
}

// Obtém os dados principais e as especificações de um produto.
async function getDetails(id) {
  const productResult = await pool.query(
    'SELECT id, name, price, image_url FROM product WHERE id = $1',
    [id]
  );

  if (productResult.rows.length === 0) {
    return null;
  }

  const specsResult = await pool.query(
    'SELECT spec_key, spec_value FROM product_specs WHERE product_id = $1',
    [id]
  );

  return { product: productResult.rows[0], specs: specsResult.rows };
}

// Pesquisa produtos pelo nome.
async function search(searchQuery, limit = 20, offset = 0) {
  const pagination = parsePagination(limit, offset);
  const result = await pool.query(
    'SELECT * FROM product WHERE name ILIKE $1 LIMIT $2 OFFSET $3',
    [`%${searchQuery}%`, pagination.limit, pagination.offset]
  );
  return result.rows;
}

function parsePagination(limit, offset) {
  const parsedLimit = Number.parseInt(limit, 10);
  const parsedOffset = Number.parseInt(offset, 10);

  return {
    limit: Number.isInteger(parsedLimit) && parsedLimit >= 0 ? parsedLimit : 20,
    offset: Number.isInteger(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0,
  };
}

function buildCategoryFilters(categoryId, filterOptions = {}) {
  const values = [categoryId];
  const conditions = ['category_id = $1'];
  const { brands, minPrice, maxPrice, sort } = filterOptions;

  if (Array.isArray(brands) && brands.length > 0) {
    values.push(brands);
    conditions.push(`brand = ANY($${values.length})`);
  }

  if (Number.isFinite(minPrice)) {
    values.push(minPrice);
    conditions.push(`price >= $${values.length}`);
  }

  if (Number.isFinite(maxPrice)) {
    values.push(maxPrice);
    conditions.push(`price <= $${values.length}`);
  }

  return { where: conditions.join(' AND '), values, sort };
}

function buildOrderBy(sort) {
  const orderBy = {
    'price-asc': 'ORDER BY price ASC',
    'price-desc': 'ORDER BY price DESC',
    'name-asc': 'ORDER BY name ASC',
    'name-desc': 'ORDER BY name DESC',
  };
  return orderBy[sort] || 'ORDER BY id ASC';
}

module.exports = { getAll, getByCategory, getCategoryFilterOptions, getDetails, search };
