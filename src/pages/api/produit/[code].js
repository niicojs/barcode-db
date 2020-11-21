import { getSession } from 'next-auth/client';
import nextConnect from 'next-connect';
import middleware from '../../../middlewares/database';
import { find } from '../../../upcdb';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  const session = await getSession({ req });
  const user = session?.user?.name || 'system';

  const code = req.query.code;
  console.log(`Get Produit ${code}`);
  const results = await req.db
    .collection('barcode')
    .find({ code }, { _id: 0 })
    .toArray();

  if (results.length === 0) {
    // fallback to UPC Database
    console.log('fallback to UPC DB');
    const info = await find(code);
    if (info) {
      info.createdAt = new Date();
      info.createdBy = user;
      info.modifiedAt = new Date();
      info.modifiedBy = user;
      await req.barcodes.insertOne(info);
      results.push(info);
    }
  }

  if (results.length > 0) {
    res.json(results[0]);
  } else {
    res.json({});
  }
});

handler.post(async (req, res) => {
  const session = await getSession({ req });
  if (!session) return res.statusCode(401).send('unauthorized');
  const user = session.user.name;

  const code = req.query.code;
  console.log(`Update Produit ${code}`);
  console.log(req.body);
  try {
    const result = await req.barcodes.updateOne(
      { code },
      {
        $set: {
          name: req.body.name,
          modifiedBy: user,
          modifiedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
          createdBy: user,
        },
      },
      { upsert: true }
    );
    console.log(result);
    const ok = result.upsertedCount > 0 || result.modifiedCount > 0;
    res.json({ ok });
  } catch (e) {
    console.log(e);
    res.json({ ok: false, error: e.message });
  }
});

handler.delete(async (req, res) => {
  const session = await getSession({ req });
  if (!session) return res.statusCode(401).send('unauthorized');

  try {
    const code = req.query.code;
    console.log(`Delete Produit ${code}`);
    const result = await req.db.collection('barcode').deleteOne({ code });
    res.json({ ok: result.deletedCount === 1 });
  } catch (e) {
    console.log(e);
    res.json({ ok: false, error: e.message });
  }
});

export default handler;
