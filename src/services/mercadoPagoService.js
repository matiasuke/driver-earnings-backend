const axios = require('axios');

const MP_API_BASE = 'https://api.mercadopago.com/v1';

// Consultar el estado real del pago directo a la API de Mercado Pago
// Nunca confiar solo en lo que llegó al webhook — siempre validar contra la API
const getPaymentDetails = async (paymentId) => {
  const response = await axios.get(`${MP_API_BASE}/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
  });
  return response.data;
};

module.exports = { getPaymentDetails };
