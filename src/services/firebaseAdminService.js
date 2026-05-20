const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // En producción (Render): leer desde variable de entorno
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    credential = admin.credential.cert(serviceAccount);
  } else {
    // En local: leer desde archivo
    const serviceAccountPath = path.resolve(
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json'
    );
    credential = admin.credential.cert(require(serviceAccountPath));
  }

  admin.initializeApp({ credential });
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
