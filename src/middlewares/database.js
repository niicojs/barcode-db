import nextConnect from 'next-connect';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function setUpDb(db) {
  db.collection('barcode').createIndex({ createdAt: -1 });
  db.collection('barcode').createIndex({ code: 1 }, { unique: true });
  db.collection('barcode').createIndex({ name: 'text' });
}

async function database(req, _, next) {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db('barcode');
  req.barcodes = client.db('barcode').collection('barcode');
  await setUpDb(req.db);
  return next();
}

const middleware = nextConnect();
middleware.use(database);

export default middleware;
