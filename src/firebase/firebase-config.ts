var admin = require("firebase-admin");
require('dotenv').config();
var serviceAccount = require(process.env.FIREBASE);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bookstore-3d941-default-rtdb.firebaseio.com"
});