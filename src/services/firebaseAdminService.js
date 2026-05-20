const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  // Ruta al serviceAccountKey.json — por defecto busca en la carpeta backend/
  const serviceAccountPath = path.resolve(
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json'
  );

  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
  });
}

const db = admin.firestore();

// Marcar usuario como premium de forma permanente
const activatePremium = async (userId, paymentId) => {
  const userRef = db.collection('users').doc(userId);
  const snap = await userRef.get();

  if (!snap.exists) {
    throw new Error(`Usuario no encontrado: ${userId}`);
  }

  await userRef.update({
    isPremium: true,
    paymentDate: new Date().toISOString(),
    paymentId,
    updatedAt: new Date().toISOString(),
  });

  console.log(`✅ Usuario ${userId} activado como premium`);
};

module.exports = { activatePremium };
