require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Ponto único de arranque do servidor HTTP.
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
