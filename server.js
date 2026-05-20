require('dotenv').config();
const express = require('express');
const cors = require('cors');
const webhookRoutes = require('./src/routes/webhookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());

// IMPORTANTE: express.json() debe ir ANTES de las rutas del webhook
// Mercado Pago envía Content-Type: application/json
app.use(express.json());

// Rutas
app.use('/api/webhooks', webhookRoutes);

// Health check — útil para verificar que el servidor está en línea
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ruta no encontrada
app.use((_, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, _, res, __) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 Webhook de MP disponible en: POST /api/webhooks/mercadopago`);
});
