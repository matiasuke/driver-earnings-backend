const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../controllers/mercadoPagoController');

// POST /api/webhooks/mercadopago
// Endpoint público que recibe notificaciones de Mercado Pago
// Registrar esta URL en: https://www.mercadopago.com.ar/developers/panel/app
router.post('/mercadopago', handleWebhook);

module.exports = router;
