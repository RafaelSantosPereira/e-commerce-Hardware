require('dotenv').config();
const { Resend } = require('resend');

// Cliente partilhado para envio de emails transacionais.
module.exports = new Resend(process.env.RESEND_API_KEY);
