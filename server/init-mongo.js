// IMPORTANT : process.env n'est PAS disponible dans les scripts d'init MongoDB.
// Les valeurs ici doivent correspondre exactement à MONGO_APP_USER
// et MONGO_APP_PASSWORD dans le fichier .env

const dbName    = 'shop_db';    // = MONGO_DB_NAME dans .env
const appUser   = 'shop_user';  // = MONGO_APP_USER dans .env
const appPassword = 'shop_password'; // = MONGO_APP_PASSWORD dans .env

db = db.getSiblingDB(dbName);

db.createUser({
  user: appUser,
  pwd: appPassword,
  roles: [{ role: 'readWrite', db: dbName }],
});


print('Utilisateur ' + appUser + ' créé sur ' + dbName);