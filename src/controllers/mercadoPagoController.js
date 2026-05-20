const { getPaymentDetails } = require('../services/mercadoPagoService');
const { activatePremium } = require('../services/firebaseAdminService');

// Procesar notificación de Mercado Pago
// Mercado Pago requiere respuesta HTTP 200 inmediata, el procesamiento puede ser async
const handleWebhook = async (req, res) => {
  // Responder 200 de inmediato para que MP no reintente el webhook
  res.sendStatus(200);

  const { type, data } = req.body;

  // Solo procesar eventos de tipo "payment"
  if (type !== 'payment' || !data?.id) {
    console.log(`[Webhook] Evento ignorado: type=${type}`);
    return;
  }

  const paymentId = data.id;
  console.log(`[Webhook] Procesando pago ID: ${paymentId}`);

  try {
    // 1. Consultar a la API de MP para validar que el pago es real
    const payment = await getPaymentDetails(paymentId);

    // 2. Verificar que el pago fue aprobado
    if (payment.status !== 'approved') {
      console.log(`[Webhook] Pago ${paymentId} no aprobado. Estado: ${payment.status}`);
      return;
    }

    // 3. Extraer el ID del usuario desde external_reference o metadata
    //    En el link de pago se envió el userId como external_reference
    const userId =
      payment.external_reference ||
      payment.metadata?.user_id;

    if (!userId) {
      console.error(`[Webhook] Pago ${paymentId} aprobado pero sin userId en external_reference`);
      return;
    }

    console.log(`[Webhook] Pago aprobado. userId=${userId} | amount=${payment.transaction_amount}`);

    // 4. Activar premium de forma permanente en Firestore
    await activatePremium(userId, String(paymentId));

  } catch (error) {
    // Registrar el error sin lanzar (ya se respondió 200 a MP)
    console.error(`[Webhook] Error procesando pago ${paymentId}:`, error.message);
  }
};

module.exports = { handleWebhook };
