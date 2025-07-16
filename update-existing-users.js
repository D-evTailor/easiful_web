// update-existing-users.js

// This is a one-time-use Node.js script to update existing Firestore users.
// It finds all users who do not have a 'subscription' field and adds a default
// free-tier subscription object to their document.

// ------------------- (IMPORTANT) -------------------
// HOW TO USE THIS SCRIPT:
// 1.  MAKE SURE THE `service-account-key.json` file is in this directory.
// 2.  RUN THE SCRIPT:
//     - Execute this script from your project's root directory using Node.js:
//       `node update-existing-users.js`
// ---------------------------------------------------

const admin = require('firebase-admin');

// --- SETUP ---
// Assumes the service account key is in the same directory and named 'service-account-key.json'
const serviceAccount = require('./service-account-key.json');

// You can find your databaseURL in your Firebase project settings.
const databaseURL = `https://${serviceAccount.project_id}.firebaseio.com`;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
});

const db = admin.firestore();
const usersRef = db.collection('users');

const defaultSubscription = {
  planId: 'free',
  status: 'active'
};

async function migrateUsers() {
  console.log('Starting user migration script (v2)...');
  let updatedUsersCount = 0;
  
  try {
    // --- (CORRECCIÓN) ---
    // En lugar de filtrar con 'where', obtenemos todos los usuarios y los filtramos en el código.
    // Esto captura correctamente los documentos donde el campo 'subscription' NO EXISTE,
    // que es el caso de tus usuarios actuales.
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log('The "users" collection is empty. Nothing to do.');
      return;
    }

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      // Revisamos si el campo 'subscription' NO está presente en los datos del usuario.
      if (!doc.data().subscription) {
        console.log(`- Scheduling update for user ID: ${doc.id}`);
        batch.update(doc.ref, { subscription: defaultSubscription });
        updatedUsersCount++;
      }
    });

    if (updatedUsersCount === 0) {
      console.log('✅ All users already have a subscription field. No migration needed.');
      return;
    }
    
    console.log(`\nFound ${updatedUsersCount} users to update.`);

    await batch.commit();

    console.log(`\n✅ Successfully updated ${updatedUsersCount} user(s). Migration complete.`);

  } catch (error) {
    console.error('❌ An error occurred during the migration:');
    console.error(error);
    console.log('\nPlease check your Firebase credentials and permissions.');
  }
}

migrateUsers(); 